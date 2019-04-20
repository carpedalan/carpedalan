import AWS from 'aws-sdk';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import { bucket } from '../../../config';
import db from '../../../db';
import { NotFoundError, PGError, AWSError } from '../../../errors';
import {
  ID,
  NAME,
  PHOTOS,
  PHOTOS_TAGS,
  TAG_ID,
  TAGS,
} from '../../../../shared/constants';
import log from '../../../../src/utils/log';

const s3 = new AWS.S3();

// eslint-disable-next-line consistent-return
const update = async (body, id) => {
  let photoResponse;
  let tags = [];
  const filteredBody = omit(body, ['tags', 'rotate', 'key']);

  if (body.rotate) {
    try {
      await s3
        .copyObject({
          Bucket: bucket,
          Key: `raw/${body.key}`,
          CopySource: `${bucket}/raw/${body.key}`,
          Metadata: {
            rotate: `${body.rotate}`,
          },
          MetadataDirective: 'REPLACE',
        })
        .promise();
    } catch (e) {
      log.error(e);
      throw new AWSError(e);
    }
  }

  try {
    if (!isEmpty(body)) {
      await db.transaction(trx =>
        trx(PHOTOS)
          .update({
            ...filteredBody,
          })
          .where({ id })
          .returning('*')
          .then(async ([photo]) => {
            if (!photo) throw new NotFoundError(id);
            photoResponse = photo;
            await trx(PHOTOS_TAGS)
              .del()
              .where({
                photoId: photo.id,
              });

            if (body.tags && body.tags.length) {
              const tagsInsert = body.tags.map(tag => ({
                photoId: photo.id,
                tagId: tag,
              }));
              await trx(PHOTOS_TAGS).insert(tagsInsert);
            }

            tags = await trx(PHOTOS_TAGS)
              .select(`${TAGS}.${NAME} as tagName`, `${TAGS}.${ID} as tagId`)
              .where({
                photoId: id,
              })
              .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`);
            return Promise.resolve();
          })
          .catch(err => {
            // trx.rollback(err);

            throw err;
          }),
      );

      return {
        ...photoResponse,
        tags: tags.map(({ tagName, tagId }) => ({ id: tagId, name: tagName })),
      };
    }
  } catch (e) {
    log.error(e);
    if (e instanceof Error) throw e;
    throw new PGError(e.detail);
  }
};

export default update;
