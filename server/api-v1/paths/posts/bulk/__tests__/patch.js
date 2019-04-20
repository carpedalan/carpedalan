import db from '../../../../../server/db';
import { PHOTOS_TAGS } from '../../../../../shared/constants';
import getTags from '../../../../services/tags/getTags';
import getSetup from '../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testAdminRoute,
} = getSetup({
  path: '/posts/bulk',
  method: 'patch',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('PATCH /posts/bulk', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it("should return a 400 if there's no body", async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json');
    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'ids'",
    );
  });

  it('should return a 400 if not all of the ids are malformed', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: '1234' });
    validate(400, response);
  });

  it('should return a 404 if not all of the ids exist', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: ['f7bbd0d4-4508-11e9-b851-bf22de2ec42d'] });
    validate(404, response);
  });

  it('should return a 200 if the patch was successful and make sure all the tags were added', async () => {
    const {
      body: { id: id1 },
    } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', description: 'description' });

    const {
      body: { id: id2 },
    } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', description: 'description' });

    const tags = await getTags();

    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({
        ids: [id1, id2],
        description: 'hallo',
        tags: [tags[0].id, tags[1].id],
      });
    validate(201, response);
    const joinRecord = await db(PHOTOS_TAGS)
      .select()
      .where({
        tagId: tags[0].id,
        photoId: id1,
      });
    expect(joinRecord.length).toBe(1);
    const joinRecord1 = await db(PHOTOS_TAGS)
      .select()
      .where({
        tagId: tags[1].id,
        photoId: id1,
      });
    expect(joinRecord1.length).toBe(1);
    const joinRecord2 = await db(PHOTOS_TAGS)
      .select()
      .where({
        tagId: tags[1].id,
        photoId: id2,
      });
    expect(joinRecord2.length).toBe(1);
    const joinRecord3 = await db(PHOTOS_TAGS)
      .select()
      .where({
        tagId: tags[0].id,
        photoId: id2,
      });
    expect(joinRecord3.length).toBe(1);
  });
});
