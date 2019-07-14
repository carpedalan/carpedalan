import getSetup from '../../testUtils';

const { afterAllCallback, validate, request, readUserAgent } = getSetup({
  path: '/login/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /login', () => {
  afterAll(afterAllCallback);

  it('should return a 400 with the right response', async () => {
    const response = await request.post('/v1/login');
    validate(400, response);
  });

  it('should return a 401 for the inccorrect password', async () => {
    const response = await readUserAgent
      .post('/v1/login')
      .send({ password: 'asdf' });

    validate(401, response);
  });
});
