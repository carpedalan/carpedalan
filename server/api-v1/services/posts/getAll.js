import db from '../../../db';
import { PGError } from '../../../errors';
import {
  ACTIVE,
  DEFAULT_POSTS_PER_PAGE,
  ID,
  IS_PENDING,
  NAME,
  PHOTO_ID,
  PHOTOS,
  PHOTOS_TAGS,
  STATUS,
  TAG_ID,
  TAGS,
  TIMESTAMP,
} from '../../../../shared/constants';

// Get all
const getAll = async ({
  order = 'desc',
  page = 1,
  isPending,
  tag,
  fields = '*',
}) => {
  // Create sub-select statement
  const fieldsToMap = ['id', TIMESTAMP, IS_PENDING, STATUS, ...fields];
  try {
    const as = 'photoz';
    let fieldsToSelect;
    if (tag) {
      fieldsToSelect = null;
    } else if (Array.isArray(fields)) {
      fieldsToSelect = fieldsToMap.map(field => `photos.${field}`);
    } else {
      fieldsToSelect = [`photos.${fields}`];
    }

    const tagName = 'tagName';
    const tagId = 'tagId';
    const limit = DEFAULT_POSTS_PER_PAGE;
    const offset = (page - 1) * limit;
    const tagWhere = tag ? { tagId: tag } : {};
    let selectStatement;
    let count;
    if (isPending) {
      selectStatement = db(PHOTOS)
        .select(fieldsToSelect)
        .orderBy(TIMESTAMP)
        .where({ [IS_PENDING]: true })
        // .andWhere(tagWhere)
        .as(as);
    } else {
      selectStatement = db(PHOTOS)
        .select(fieldsToSelect)
        .orderBy(TIMESTAMP, order)
        .limit(limit)
        .offset(offset)
        .where({ 'photos.status': ACTIVE })
        .andWhere({ 'photos.isPending': false })
        .as(as);
    }
    if (tag) {
      selectStatement = selectStatement
        .select('photos.*', 'tags.name as tagName', 'tags.id as tagId')
        .leftJoin('photos_tags', 'photos_tags.photoId', 'photos.id')
        .leftJoin('tags', 'tags.id', 'photos_tags.tagId')
        .where({ [IS_PENDING]: false, [STATUS]: ACTIVE, ...tagWhere });
    } else {
      ({ count } = await db(PHOTOS)
        .where({ [STATUS]: ACTIVE })
        .count()
        .first());
    }

    // Join with many-to-many tables
    const photos = await db
      .select(
        `${TAGS}.${NAME} as ${tagName}`,
        `${TAGS}.${ID} as ${tagId}`,
        `${as}.*`,
      )
      .from(selectStatement)
      .leftJoin(PHOTOS_TAGS, `${PHOTOS_TAGS}.${PHOTO_ID}`, `${as}.${ID}`)
      .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`)
      .orderBy(`${as}.${TIMESTAMP}`, order);

    // Combine tag entries with the same photo id
    const dedupped = photos.reduce((acc, photo) => {
      const existing = acc.find(({ id }) => id === photo[ID]);
      if (existing) {
        if (photo[tagId]) {
          existing.tags.push({
            id: photo[tagId],
            name: photo[tagName],
          });
        }
        return acc;
      }
      return [
        ...acc,
        {
          ...photo,
          tags: photo[tagId]
            ? [{ id: photo[tagId], name: photo[tagName] }]
            : [],
          [tagName]: undefined,
          [tagId]: undefined,
        },
      ];
    }, []);
    if (tag) {
      count = dedupped.length;
    }
    return {
      data: dedupped,
      meta: {
        page,
        count: Number(count),
        pages: Math.floor(Number(count) / limit) + 1,
      },
    };
  } catch (e) {
    throw new PGError(e.detail);
  }
};

export default getAll;
