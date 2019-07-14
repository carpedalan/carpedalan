import getSetup from '../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testAdminRoute,
} = getSetup({
  path: '/tags/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /tags', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it('should return 400 if there is no post body', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json');

    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it('should return 400 if there is no name in post body body', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json')
      .send({});

    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it('should return a 201 with the right response shape', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json')
      .send({ name: 'whatt ' });

    validate(201, response);
  });
});
