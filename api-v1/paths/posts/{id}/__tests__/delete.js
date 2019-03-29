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
const path = '/posts/{id}';
let responses;
describe('DELETE /posts/{id}', () => {
  const { components } = openApiDoc.args.apiDoc;
  let id;
  beforeAll(async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
    ({ responses } = openApiDoc.apiDoc.paths[path].delete);
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should return a 401 with the right response', async () => {
    const response = await request.del(`/v1/posts/${id}`);

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });
  it('should have the right response for read user agent', async () => {
    const response = await readUserAgent.del(`/v1/posts/${id}`);

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(403, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(403);
  });

  it('it should return a 400 the uuid is bad', async () => {
    const response = await writeUserAgent.del(`/v1/posts/farts`);
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toMatchObject({
      path: 'id',
      errorCode: 'format.openapi.validation',
      message: 'should match format "uuid"',
      location: 'path',
    });
  });

  it('it should return a 404 if there is no record', async () => {
    const response = await writeUserAgent.del(
      `/v1/posts/f7bbd0d4-4508-11e9-b851-bf22de2ec42d`,
    );
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(404, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(404);
  });

  it('should return a 204 with an empty body if successfully deleted', async () => {
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    ({ id } = body);

    const response = await writeUserAgent.del(`/v1/posts/${id}`);
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(
      204,
      isEmpty(response.body) ? null : response.body,
    );

    expect(validation).toBeUndefined();
    expect(response.status).toBe(204);
  });
});
