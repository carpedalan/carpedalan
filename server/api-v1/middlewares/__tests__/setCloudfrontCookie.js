let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

const mockCookies = {
  CookieOne: 'one',
  CookieTwo: 'two',
};
jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => mockCookies),
}));

describe('Cloudfront cookie test', () => {
  const { components } = openApiDoc.args.apiDoc;
  const { responses } = openApiDoc.apiDoc.paths['/refresh/'].post;
  const responseValidator = { components, responses };
  beforeAll(async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should return a 401 with the right response', async () => {
    const response = await request.post('/v1/refresh');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.header).not.toHaveProperty('set-cookie');
    expect(response.status).toBe(401);
  });

  // it.skip('send set cookie headers if authenticated', async () => {
  //   const response = await readUserAgent.post('/v1/refresh/');

  //   const instance = new OpenApiResponseValidator(responseValidator);
  //   const validation = instance.validateResponse(200, response);

  //   expect(validation).toBeUndefined();
  //   console.error('response.headers', response.headers);
  //   expect(response.status).toBe(200);
  // });
});
