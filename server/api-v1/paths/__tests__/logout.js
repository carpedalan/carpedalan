import getSetup from '../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  validate,
  request,
  readUserAgent,
} = getSetup({
  path: '/logout/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

/**
 * This test is ignored by wallaby!
 *
 */
describe('POST /logout', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);
  it('should return a 200 with the right response', async () => {
    const response = await request.post('/v1/logout');
    validate(200, response);
  });

  it('should logout successfully', async () => {
    const response = await readUserAgent.post('/v1/logout');
    const authRoute = await readUserAgent.get('/v1/posts');
    validate(200, response);
    expect(authRoute.status).toBe(401);
  });
});
