import getSetup from '../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  createActivePost,
  testReadRoute,
  validUuid,
} = getSetup({
  path: '/posts/{id}',
  method: 'get',
});
jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /posts/{id}', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testReadRoute();

  it('it should return a 400 the uuid is bad', async () => {
    const response = await writeUserAgent.get(`/v1/posts/farts`);
    validate(400, response);
    expect(response.body.errors[0]).toMatchObject({
      path: 'id',
      errorCode: 'format.openapi.validation',
      message: 'should match format "uuid"',
      location: 'path',
    });
  });

  it('it should return a 404 if there is no record', async () => {
    const response = await writeUserAgent.get(`/v1/posts/${validUuid}`);
    validate(404, response);
  });

  it('should return a 200 with an empty body if successfully geteted', async () => {
    const id = await createActivePost();
    const response = await writeUserAgent.get(`/v1/posts/${id}`);
    validate(200, response);
  });
});
