import db from '../../../db';

export default async function(name) {
  const [tagsResponse] = await db('tags')
    .insert({ name })
    .returning('*');
  return tagsResponse;
}
