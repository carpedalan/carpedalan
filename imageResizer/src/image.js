/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */

const sharp = require('sharp');
const aws = require('aws-sdk');
// const sqip = require('sqip');
const knex = require('knex');
const exif = require('exif-parser');
// const pg = require('pg');

const { SIZES, EXIFPROPS } = require('./constants');

const s3 = new aws.S3();

exports.imageResizer = async (event, context, ...otherThingz) => {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  console.time('fire');
  console.log('EVENT=============');
  console.log(JSON.stringify(event));
  console.log('CONTEXT ==========================================');
  console.log(JSON.stringify(context));
  console.log('rest==========================================');
  console.log(JSON.stringify(otherThingz));
  const key = event.Records[0].s3.object.key;
  const bucket = event.Records[0].s3.bucket.name;
  console.error('bucket', bucket);
  console.error('sizes', SIZES);

  let buffer;
  try {
    console.log('hello?');
    console.time('s3');
    buffer = await s3
      .getObject({
        Key: key,
        Bucket: bucket,
      })
      .promise();
    console.log('buffer', buffer);
  } catch (e) {
    console.log('getObject error', JSON.stringify(e));
  } finally {
    console.timeEnd('s3');
  }
  // / TODO CHECK METADATA FOR ROTATE HERE

  console.log('rotate', buffer.Metadata.rotate);
  let resized;
  let rotated;
  let exifData;
  try {
    const parser = exif.create(buffer.Body);
    exifData = parser.parse();
    console.log('exifData', exifData);
  } catch (e) {
    console.log('exif error', e);
  }
  const rotate = buffer.Metadata.rotate
    ? Number(buffer.Metadata.rotate) + (exifData.Orientation === 6 ? 90 : 0)
    : null;
  try {
    console.time('sharp');
    rotated = await sharp(buffer.Body)
      .rotate(rotate)
      .toBuffer();
    const jpegPromises = SIZES.map(size =>
      sharp(rotated)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })
        .jpeg({ quality: 80 })
        .toBuffer(),
    );
    const webpPromises = SIZES.map(size =>
      sharp(rotated)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })

        .webp({ quality: 80 })
        .toBuffer(),
    );
    resized = await Promise.all([...jpegPromises, ...webpPromises]);
  } catch (e) {
    console.log('sharp error', e);
  } finally {
    console.timeEnd('sharp');
  }
  let response;
  const withoutOriginal = key.split('/')[1];
  const withoutExtension = withoutOriginal.split('.')[0];
  const rotateString = rotate ? `-${rotate}` : '';
  try {
    console.time('put');

    const putPromises = resized.map((resize, index) => {
      const isJpeg = index < SIZES.length;
      const extension = isJpeg ? 'jpg' : 'webp';
      const contentType = isJpeg ? 'image/jpeg' : 'image/webp';
      const size = SIZES[index % SIZES.length];
      return s3
        .upload({
          Key: `web/${withoutExtension}${rotateString}-${size.width}${
            size.height ? `-${size.height}` : ''
          }.${extension}`,
          Bucket: bucket,
          Body: resize,
          ContentType: contentType,
        })
        .promise();
    });

    const rotatedOriginalPromise = s3
      .upload({
        Key: `original/${withoutExtension}${rotateString}.jpg`,
        Bucket: bucket,
        Body: rotated,
        ContentType: 'image/jpeg',
      })
      .promise();
    await Promise.all([...putPromises, rotatedOriginalPromise]);
  } catch (e) {
    console.log(e);
    console.log('upload error', JSON.stringify(e));
    throw e;
  } finally {
    console.timeEnd('put');
  }

  // Update record
  try {
    const validExifData = Object.keys(EXIFPROPS).reduce(
      (acc, exifKey) => ({
        ...acc,
        ...(exifData.tags[exifKey]
          ? { [EXIFPROPS[exifKey]]: exifData.tags[exifKey] }
          : {}),
      }),
      {},
    );
    const db = knex({
      client: 'pg',
      connection: process.env.PG_URI,
      pool: {
        min: 2,
        max: 10,
      },
    });
    console.log(validExifData);
    console.log(withoutOriginal);
    // Check for bad exif
    // const success = false;
    console.error(`original/${withoutExtension}${rotateString}.jpg`);

    let updateClause = {
      key: `original/${withoutExtension}${rotateString}.jpg`,
    };
    if (!exifData || !exifData.tags) {
      updateClause = {
        isPending: true,
      };
    } else if (
      !exifData.tags.DateTimeOriginal ||
      !exifData.tags.ImageHeight ||
      !exifData.tags.ImageWidth
    ) {
      updateClause = {
        isPending: true,
      };
    } else {
      updateClause = {
        timestamp: exifData.tags.DateTimeOriginal,
        status: 'active',
        isPending: false,
        ...validExifData,
      };
    }

    const pgResponse = await db('photos')
      .update(updateClause)
      .where('key', `original/${withoutOriginal}`)
      .returning('*');
    console.log('pgResponse', pgResponse);
  } catch (e) {
    console.log('PG error', e);
  }

  console.timeEnd('fire');
  return response;
};
