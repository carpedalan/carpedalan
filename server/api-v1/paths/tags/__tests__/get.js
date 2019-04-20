import getSetup from '../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  readUserAgent,
  validate,
  testReadRoute,
} = getSetup({
  path: '/tags/',
  method: 'get',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /tags', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testReadRoute();

  it('should have the right response', async () => {
    const response = await readUserAgent.get('/v1/tags');
    validate(200, response);
  });
});
