import getSetup from '../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testReadRoute,
} = getSetup({
  path: '/user/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /user', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testReadRoute();

  it("should return a return a 400 if the name insn't present", async () => {
    const response = await writeUserAgent
      .post('/v1/user')
      .send({ hello: 'there' });

    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      'should NOT have additional properties',
    );
  });

  it("should return a return a 200 the content type isn't specified", async () => {
    const response = await writeUserAgent
      .post('/v1/user')
      .send({ requests: 3 });
    validate(200, response);
  });
});
