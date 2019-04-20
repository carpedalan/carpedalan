import getSetup from '../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testAdminRoute,
} = getSetup({
  path: '/upload/',
  method: 'get',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /upload', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it("should return a return a 400 if the name insn't present", async () => {
    const response = await writeUserAgent.get('/v1/upload');

    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it("should return a return a 400 the content type isn't specified", async () => {
    const response = await writeUserAgent.get('/v1/upload?name=something.jpg');

    validate(201, response);
  });
});
