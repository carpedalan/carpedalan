let request = require('supertest');

const { setup } = require('../server');

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('Webapp Routes', () => {
  beforeAll(async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
  });

  afterAll(async () => {
    await readUserAgent.app.close();
    await writeUserAgent.app.close();
    await pool.end();
    await store.close();
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a page', async () => {
    const { status } = await request.get('/');
    expect(status).toBe(200);
  });

  it('should render a page for login', async () => {
    const { status } = await request.get('/login');
    expect(status).toBe(200);
  });

  it('should redirect from admin', async () => {
    const { status } = await readUserAgent.get('/admin/');
    expect(status).toBe(301);
  });

  it('should redirect from admin if not logged in', async () => {
    const { status } = await request.get('/admin/');
    expect(status).toBe(301);
  });

  it('should provide a healthcheck', async () => {
    const { status } = await request.get('/healthcheck/');
    expect(status).toBe(200);
  });

  it('should serve a robots.txt', async () => {
    const { status, text } = await request.get('/robots.txt');
    expect(status).toBe(200);
    expect(text).toBe('User-agent: *\nDisallow: /');
  });

  it('should send a 404 for other routes', async () => {
    const { status } = await writeUserAgent.get('/foo/');
    expect(status).toBe(404);
  });
});
