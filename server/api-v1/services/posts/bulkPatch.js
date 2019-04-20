import db from '../../../db';
import { BadRequestError, NotFoundError } from '../../../errors';
import { DESCRIPTION, PHOTOS, PHOTOS_TAGS } from '../../../../shared/constants';

const bulkPatch = async ({ ids, tags, description }) => {
  try {
    const photosTagsInsert = ids.reduce((acc, photoId) => {
      const photoTags = (tags || []).map(tagId => ({
        photoId,
        tagId,
      }));
      return [...acc, ...photoTags];
    }, []);
    await db.transaction(async trx => {
      let records = 0;
      try {
        if (description) {
          records = await trx(PHOTOS)
            .update({
              [DESCRIPTION]: description,
            })
            .whereIn('id', ids);
        }
        // eslint-disable-next-line eqeqeq
        if (ids.length != records) {
          throw new NotFoundError(JSON.stringify(ids));
        }
        if (tags.length) {
          await trx(PHOTOS_TAGS).insert(photosTagsInsert);
        }
      } catch (e) {
        if (e instanceof Error) throw e;

        throw new BadRequestError(e.detail);
      }
    });
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new BadRequestError(e.detail);
  }
};

export default bulkPatch;
