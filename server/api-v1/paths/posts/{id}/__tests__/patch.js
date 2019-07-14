import AWS from 'aws-sdk';

import createTag from '../../../../services/tags/createTag';
import getSetup from '../../../../testUtils';

const {
  afterAllCallback,
  beforeAllCallback,
  writeUserAgent,
  validate,
  createPost,
  testAdminRoute,
} = getSetup({
  path: '/posts/{id}',
  method: 'patch',
});

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

jest.mock('aws-sdk', () => {
  const mockAWS = {};
  mockAWS.copyObject = jest.fn().mockReturnThis();

  mockAWS.s3Promise = jest.fn(() => Promise.resolve({}));
  mockAWS.sendEmailMock = jest.fn().mockReturnThis();

  mockAWS.sesPromise = jest.fn(() => Promise.resolve({}));

  mockAWS.S3 = function() {};

  mockAWS.S3.prototype = {
    ...mockAWS.S3.prototype,
    copyObject: mockAWS.copyObject,
    promise: mockAWS.s3Promise,
  };
  mockAWS.SES = function() {};

  mockAWS.SES.prototype = {
    ...mockAWS.SES.prototype,
    sendEmail: mockAWS.sendEmailMock,
    promise: mockAWS.sesPromise,
  };
  return mockAWS;
});

describe('PATCH /posts/{id}', () => {
  beforeAll(beforeAllCallback);

  afterAll(afterAllCallback);

  testAdminRoute();

  it('it should return a 400 the uuid is bad', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/farts`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });
    validate(400, response);
    expect(response.body.errors[0]).toMatchObject({
      path: 'id',
      errorCode: 'format.openapi.validation',
      message: 'should match format "uuid"',
      location: 'path',
    });
  });

  it('it should return a 404 if there is no record', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/f7bbd0d4-4508-11e9-b851-bf22de2ec42d`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });

    validate(404, response);
  });

  it('should return a 200 if the post was patched', async () => {
    const id = await createPost();

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });
    validate(200, response);
  });

  it('should call copy object if rotate is supplied', async () => {
    const id = await createPost();
    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', rotate: 90 });

    validate(200, response);
    expect(AWS.S3.prototype.copyObject).toHaveBeenCalledTimes(1);
    expect(AWS.S3.prototype.copyObject).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: 'raw/something.jpg',
        Metadata: {
          rotate: '90',
        },
      }),
    );
  });
  it('should throw if the rotate angle is weird', async () => {
    const id = await createPost();
    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', rotate: 91 });
    validate(400, response);
  });

  it('can update tags', async () => {
    const { id: tag1Id } = await createTag('tag1');
    const { id: tag2Id } = await createTag('tag2');
    const { id: tag3Id } = await createTag('tag3');
    const { id: tag4Id } = await createTag('tag4');
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', tags: [tag1Id, tag2Id] });

    const { id } = body;

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', tags: [tag3Id, tag4Id] });
    validate(200, response);
    expect(response.body.tags[0].id).toBe(tag3Id);
    expect(response.body.tags[1].id).toBe(tag4Id);
  });
});
