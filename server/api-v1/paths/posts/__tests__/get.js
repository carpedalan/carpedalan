import { DESCRIPTION, KEY } from '../../../../../shared/constants';
import getSetup from '../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  readUserAgent,
  validate,
  testReadRoute,
} = getSetup({
  path: '/posts/',
  method: 'get',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /posts', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testReadRoute();

  it('should get the isPenbding posts', async () => {
    const response = await readUserAgent.get('/v1/posts?isPending=true');
    validate(200, response);
    const isPendingFalse = response.body.data.filter(
      ({ isPending }) => !isPending,
    );
    expect(isPendingFalse.length).toBe(0);
  });
  it('should have the right response', async () => {
    const response = await readUserAgent.get('/v1/posts?page=1');
    validate(200, response);
  });

  it('should return the fields specified', async () => {
    const response = await readUserAgent.get(
      `/v1/posts?page=1&fields[]=${KEY}`,
    );
    validate(200, response);
    expect(response.body.data[0]).toHaveProperty(KEY);
    expect(response.body.data[0]).not.toHaveProperty(DESCRIPTION);
  });

  it('it should return the right order', async () => {
    const response = await readUserAgent.get(`/v1/posts?page=1`);

    validate(200, response);
    if (!response.body.data[0].timestamp) return true;
    expect(response.body.data[0].timestamp).toBeGreaterThan(
      response.body.data[1].timestamp,
    );
    return true;
  });
});
