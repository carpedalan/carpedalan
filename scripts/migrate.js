const fs = require('fs');

const reduce = require('lodash/reduce');
const aws = require('aws-sdk');
const request = require('superagent'); // eslint-disable-line import/no-extraneous-dependencies
const uniq = require('lodash/uniq');

const data = require('../data'); // eslint-disable-line import/no-unresolved

const obj = data.tumblr.data;
/* eslint-disable no-console */
const s3 = new aws.S3({
  region: 'us-west-2',
});
const allTags = [];
const goodData = reduce(
  obj,
  (acc, val) => {
    if (val.type !== 'photo') return acc;
    const tags = val.tags.map(tag => {
      const lowerTag = tag.toLowerCase();
      allTags.push(lowerTag);
      return lowerTag;
    });

    return [
      ...acc,
      {
        id: val.id,
        timestamp: val.timestamp,
        date: val.date,
        url: val.photos[0].original_size.url,
        width: val.photos[0].original_size.width,
        height: val.photos[0].original_size.height,
        caption: val.photos[0].original_size.caption,
        summary: val.summary,
        exif: val.photos[0].exif,
        tags,
      },
    ];
  },
  [],
);

fs.writeFile(
  'goodData.json',
  JSON.stringify(goodData, null, 2),
  'utf8',
  () => {},
);
const values = [];
const errors = [];
let count = 0;
async function upload() {
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const val of goodData) {
    count += 1;
    console.log('complete: ', count / goodData.length);
    let buffer;
    try {
      buffer = await request
        .get(val.url)
        .buffer(true)
        .parse(request.parse.image)
        .then(res => res.body);
    } catch (e) {
      console.log('fucking failure!!!!', e);
    }
    console.error('summary', val.summary);
    console.error('timestamp', val.timestamp);

    const params = {
      Body: buffer,
      Bucket: 'carpedev-west',
      Key: `original/${val.id}-${val.width}-${val.height}.jpg`,
      ContentType: 'image/jpeg',
    };
    try {
      const response = await s3.upload(params).promise();
      console.log('res', response);
      values.push({ ...val, s3: response.ETag });
    } catch (e) {
      console.log('upload failure');
      console.log(e);
      errors.push(val);
    }
  }
  return { values, errors };
}

async function log() {
  const { values: logValues, errors: logErrors } = await upload();
  fs.writeFile(
    'goodDataWithEtag.json',
    JSON.stringify(logValues, null, 2),
    'utf8',
    () => {},
  );
  fs.writeFile(
    'errors.json',
    JSON.stringify(logErrors, null, 2),
    'utf8',
    () => {},
  );
  console.log('count', count);
}

log();

console.log(uniq(allTags));
