import db from '../../../db';
import { PGError } from '../../../errors';
import {
  DELETED,
  DESCRIPTION,
  IS_PENDING,
  KEY,
  PHOTOS,
  PHOTOS_TAGS,
  STATUS,
  TAGS,
} from '../../../../shared/constants';

const create = async body => {
  let pgResponse;
  const description = body[DESCRIPTION];
  const { key } = body;
  const tags = body[TAGS] ? body[TAGS] : false;
  try {
    await db.transaction(trx =>
      trx(PHOTOS)
        .insert({
          [KEY]: `original/${key}`,
          [DESCRIPTION]: description,
          [STATUS]: DELETED,
          [IS_PENDING]: true,
        })
        .returning('*')
        .then(photo => {
          pgResponse = photo;

          if (tags.length) {
            const tagsInsert = tags.map(tag => ({
              photoId: photo[0].id,
              tagId: tag,
            }));

            return trx(PHOTOS_TAGS).insert(tagsInsert);
          }
          return Promise.resolve();
        })
        .catch(trx.rollback),
    );
  } catch (e) {
    throw new PGError(e.detail);
  }

  return pgResponse[0];
};

export default create;
