const { PHOTOS_TAGS, TAGS, PHOTOS } = require('../../../shared/constants');
const { photos, tags, photosTags } = require('../data');

exports.seed = async knex => {
  await knex(PHOTOS_TAGS).del();
  await Promise.all([knex(TAGS).del(), knex(PHOTOS).del()]);
  await Promise.all([knex(PHOTOS).insert(photos), knex(TAGS).insert(tags)]);
  await knex(PHOTOS_TAGS).insert(photosTags);
};
