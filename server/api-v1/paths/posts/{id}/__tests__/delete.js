import getSetup from '../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validUuid,
  validate,
  createPost,
  testAdminRoute,
} = getSetup({
  path: '/posts/{id}',
  method: 'delete',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('DELETE /posts/{id}', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it('it should return a 400 the uuid is bad', async () => {
    const response = await writeUserAgent.del(`/v1/posts/farts`);
    validate(400, response);
    expect(response.body.errors[0]).toMatchObject({
      path: 'id',
      errorCode: 'format.openapi.validation',
      message: 'should match format "uuid"',
      location: 'path',
    });
  });

  it('it should return a 404 if there is no record', async () => {
    const response = await writeUserAgent.del(`/v1/posts/${validUuid}`);
    validate(404, response);
  });

  it('should return a 204 with an empty body if successfully deleted', async () => {
    const id = await createPost();
    const response = await writeUserAgent.del(`/v1/posts/${id}`);
    validate(204, response);
  });
});
