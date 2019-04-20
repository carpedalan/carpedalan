import db from '../../../db';
import { BadRequestError, NotFoundError } from '../../../errors';
import { DELETED, PHOTOS, STATUS } from '../../../../shared/constants';

const bulkDelete = async ids => {
  try {
    await db.transaction(async trx => {
      try {
        const records = await trx(PHOTOS)
          .update({
            [STATUS]: DELETED,
          })
          .whereIn('id', ids);
        // eslint-disable-next-line eqeqeq
        if (ids.length != records) {
          throw new NotFoundError(JSON.stringify(ids));
        }
      } catch (e) {
        throw e;
      }
    });
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new BadRequestError('PG error');
  }
};

export default bulkDelete;
