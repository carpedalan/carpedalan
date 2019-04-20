import db from '../../../db';
import { NotFoundError } from '../../../errors';
import { DELETED, STATUS } from '../../../../shared/constants';

const del = async id => {
  const response = await db('photos')
    .update({ [STATUS]: DELETED })
    .where({ id });

  if (!response) throw new NotFoundError('id');
  return response;
};

export default del;
