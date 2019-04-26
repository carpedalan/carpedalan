import { v4 as uuid } from 'uuid';
import isEmpty from 'lodash/isEmpty';

/* eslint-disable import/no-extraneous-dependencies */
let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../server/server');

export default function getSetup({ path, method }) {
  const { app, store, pool, openApiDoc } = setup();
  const readUserAgent = request.agent(app);
  const writeUserAgent = request.agent(app);
  request = request(app);
  const { responses } = openApiDoc.apiDoc.paths[path][method];

  const beforeAllCallback = async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
  };

  const afterAllCallback = async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  };

  const { components } = openApiDoc.args.apiDoc;

  const instance = new OpenApiResponseValidator({
    responses,
    components,
  });

  const validate = (status, response) => {
    const validation = instance.validateResponse(
      status,
      isEmpty(response.body) ? null : response.body,
    );
    expect(validation).toBeUndefined();
    expect(response.status).toBe(status);
  };
  const validUuid = uuid();

  const createPost = async () => {
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });
    return body.id;
  };

  const testAdminRoute = () => {
    const route = path.replace('{id}', validUuid);

    it('should return a 401 with the right response', async () => {
      const response = await request[method](`/v1${route}`);
      validate(401, response);
    });

    it('should have the right response for read user agent', async () => {
      const response = await readUserAgent[method](`/v1${route}`);
      validate(403, response);
    });
  };

  const createActivePost = async () => {
    const id = await createPost();
    await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', status: 'active' });

    return id;
  };

  const testReadRoute = () => {
    const route = path.replace('{id}', validUuid);
    // eslint-disable-next-line jest/no-identical-title
    it('should return a 401 with the right response', async () => {
      const response = await request[method](`/v1${route}`);
      validate(401, response);
    });
  };

  return {
    testReadRoute,
    createActivePost,
    testAdminRoute,
    createPost,
    validate,
    validUuid,
    instance,
    request,
    responses,
    app,
    afterAllCallback,
    beforeAllCallback,
    readUserAgent,
    writeUserAgent,
    openApiDoc,
  };
}
