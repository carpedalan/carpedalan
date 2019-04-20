import getSetup from '../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  testAdminRoute,
} = getSetup({
  path: '/posts/bulk',
  method: 'delete',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('DELETE /posts/bulk', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it("should return a 400 if there's no body", async () => {
    const response = await writeUserAgent
      .del(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json');
    validate(400, response);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'ids'",
    );
  });

  it('should return a 400 if not all of the ids are malformed', async () => {
    const response = await writeUserAgent
      .del(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: '1234' });
    validate(400, response);
  });

  it('should return a 404 if not all of the ids exist', async () => {
    const response = await writeUserAgent
      .del(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: ['f7bbd0d4-4508-11e9-b851-bf22de2ec42d'] });
    validate(404, response);
  });

  it('should return a 204 if the delete was successful', async () => {
    const {
      body: { id: id1 },
    } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    const response = await writeUserAgent
      .del(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: [id1] });
    validate(204, response);
  });

  it('should return a 404 if one was not found', async () => {
    const {
      body: { id: id1 },
    } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    const response = await writeUserAgent
      .del(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: [id1, 'f7bbd0d4-4508-11e9-b851-bf22de2ec42d'] });
    validate(404, response);
  });
});
