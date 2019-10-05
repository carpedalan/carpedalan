import getSetup from '../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testAdminRoute,
} = getSetup({
  path: '/posts/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /posts', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it("should return a 400 the content type isn't specified", async () => {
    const response = await writeUserAgent.post('/v1/posts');
    validate(400, response);
  });

  // it("should return a return a 400 if the key insn't present", async () => {
  //   const response = await writeUserAgent
  //     .post('/v1/posts')
  //     .set('Content-Type', 'application/json');

  //   validate(400, response);
  //   expect(response.body.errors[0].message).toMatch(
  //     "should have required property 'key'",
  //   );
  // });

  // it("should return a return a 400 the content type isn't specified", async () => {
  //   const response = await writeUserAgent
  //     .post('/v1/posts')
  //     .set('Content-Type', 'application/json');

  //   validate(400, response);
  //   expect(response.body.errors[0].message).toMatch(
  //     "should have required property 'key'",
  //   );
  // });

  it('should return a return a 400 the additional fields are specified', async () => {
    const response = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ farts: 'foo', key: 'something' });

    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      'should NOT have additional properties',
    );
  });

  it('should return a return a 400 if key is the wrong format', async () => {
    const response = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something' });

    validate(400, response);
    expect(response.body.errors[0].message).toMatch('should match pattern');
  });

  it('should return a return a 201 if key is the wrong format', async () => {
    const response = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    validate(201, response);
    // expect(response.body.errors[0].message).toMatch('should match pattern');
  });
});
