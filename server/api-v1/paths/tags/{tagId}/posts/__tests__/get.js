import createTag from '../../../../../services/tags/createTag';
import getSetup from '../../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  readUserAgent,
  writeUserAgent,
  validate,
  testReadRoute,
} = getSetup({
  path: '/tags/{tagId}/posts',
  method: 'get',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /tags/{tagId}/posts', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testReadRoute();
  let id;
  beforeEach(async () => {
    ({ id } = await createTag('myTag'));
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', tags: [id] });

    await writeUserAgent
      .patch(`/v1/posts/${body.id}`)
      .set('Content-Type', 'application/json')
      .send({
        status: 'active',
        tags: [id],
        isPending: false,
        key: 'something.jpg',
      });
  });

  it('should return one record and a 200', async () => {
    const response = await readUserAgent.get(`/v1/tags/${id}/posts`);
    validate(200, response);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].tags.length).toBe(1);
    expect(response.body.data[0].tags[0].id).toBe(id);
  });
});
