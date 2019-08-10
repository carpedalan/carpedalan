import getSetup from '../../testUtils';

const mockSES = jest.fn(() => ({ promise: jest.fn() }));
const mockPromise = jest.fn(() => Promise.resolve({ farts: 'stinky' }));
jest.mock(
  'aws-sdk/clients/ses',
  () =>
    class SES {
      sendEmail(...args) {
        mockSES(...args);
        return this;
      }
      // eslint-disable-next-line
      promise() {
        return mockPromise();
      }
    },
);

const { afterAllCallback, validate, request } = getSetup({
  path: '/invitation/',
  method: 'post',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /invitation', () => {
  afterAll(afterAllCallback);

  it('should require a name', async () => {
    const response = await request
      .post('/v1/invitation/')
      .set('Content-Type', 'application/json');
    validate(400, response);
    expect(response.body.errors[0].message).toBe(
      "should have required property 'email'",
    );
  });

  it('should require an email', async () => {
    const response = await request
      .post('/v1/invitation/')
      .set('Content-Type', 'application/json')
      .send({ name: 'farts' });
    validate(400, response);
    expect(response.body.errors[0].message).toBe(
      "should have required property 'email'",
    );
  });

  it('should have a valid email', async () => {
    const response = await request
      .post('/v1/invitation/')
      .set('Content-Type', 'application/json')
      .send({ name: 'farts', email: 'asdf' });
    validate(400, response);

    expect(response.body.errors[0].message).toBe('should match format "email"');
  });

  it('should send an email', async () => {
    await request
      .post('/v1/invitation/')
      .set('Content-Type', 'application/json')
      .send({ name: 'farts', email: 'leif@fo.co' });

    expect(mockSES).toHaveBeenCalledTimes(1);
    expect(mockSES.mock.calls[0]).toMatchSnapshot();
  });

  // it.skip('should forward the error', async () => {
  //   mockPromise.mockImplementation = () => Promise.reject();
  //   const response = await request
  //     .post('/v1/invitation/')
  //     .set('Content-Type', 'application/json')
  //     .send({ name: 'farts', email: 'leif@fo.co' });
  //   expect(response.body).toBe('something');
  // });
});
