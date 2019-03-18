import isEmpty from 'lodash/isEmpty';

let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));
const path = '/posts/bulk';
let responses;
describe('PATCH /posts/bulk', () => {
  const { components } = openApiDoc.args.apiDoc;
  beforeAll(async () => {
    await readUserAgent.post('/api/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/api/login').send({ password: 'testadmin' });
    ({ responses } = openApiDoc.apiDoc.paths[path].patch);
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should return a 401 with the right response', async () => {
    const response = await request.patch(`/v1/posts/bulk`);

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it('it should return a 401 the read user tries to ', async () => {
    const response = await readUserAgent.patch(`/v1/posts/bulk`);
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(403, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(403);
  });

  it("should return a 400 if there's no body", async () => {
    // const response = await writeUserAgent
    //   .post('/v1/posts')
    //   .set('Content-Type', 'application/json')
    //   .send({ key: 'something.jpg' });

    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json');
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'ids'",
    );
  });

  it('should return a 400 if not all of the ids are malformed', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: '1234' });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
  });

  it('should return a 404 if not all of the ids exist', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: ['f7bbd0d4-4508-11e9-b851-bf22de2ec42d'] });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(404, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(404);
  });

  it('should return a 200 if the patchete was successful', async () => {
    const {
      body: { id: id1 },
    } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    const response = await writeUserAgent
      .patch(`/v1/posts/bulk`)
      .set('Content-Type', 'application/json')
      .send({ ids: [id1], description: 'hallo' });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(
      201,
      isEmpty(response.body) ? null : response.body,
    );

    expect(validation).toBeUndefined();
    expect(response.status).toBe(201);
  });
});
