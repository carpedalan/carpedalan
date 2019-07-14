#!/usr/bin/env node

const fs = require('fs');

const exif = require('exif-parser'); // eslint-disable-line import/no-unresolved
const glob = require('glob'); // eslint-disable-line

let db;

const main = async () => {
  // await connectionPromise;
  const errors = [];
  const matches = [];
  glob('photos/**/*.jpg', async (er, files) => {
    /* eslint-disable no-restricted-syntax,no-await-in-loop,no-console */

    for (const file of files) {
      const buffer = fs.readFileSync(file);
      let timestamp;
      try {
        const parser = exif.create(buffer);
        const result = parser.parse();
        timestamp = result.tags.CreateDate;
        // console.log(timestamp);
      } catch (e) {
        // console.log('exif', e);
        errors.push({
          type: 'exifError',
          error: e,
        });
      }
      let match;
      try {
        if (timestamp) {
          match = await db('photos')
            .select()
            .whereBetween('timestamp', [
              timestamp + 25250 - 5,
              timestamp + 25250 + 5,
            ])
            .first();
        }
      } catch (e) {
        console.log('dbError', e);
        errors.push({
          type: 'dbError',
          error: e,
        });
      }
      if (match) {
        console.log(matches.length);
        matches.push({
          match,
          file,
          timestamp,
        });
      }
    }
    console.log('errors', errors);
    console.log('files', files.length);
    console.log('matches', matches);
    return Promise.resolve(matches);
  });
  return Promise.resolve();
};

main();
