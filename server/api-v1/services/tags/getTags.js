import db from '../../../db';

export default async function() {
  const tagsResponse = await db('tags').select();
  const counts = await db('photos_tags')
    .select('tagId')
    .count('*')
    .groupBy('tagId');

  const countsById = counts.reduce(
    (acc, count) => ({
      ...acc,
      [count.tagId]: count.count,
    }),
    {},
  );

  const withCount = tagsResponse.map(tag => ({
    ...tag,
    count: Number(countsById[tag.id]) || 0,
  }));
  return withCount;
}
