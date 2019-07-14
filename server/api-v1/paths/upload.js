import { commonErrors } from '../refs/error';

const status = 201;

export default function(aws) {
  const get = (req, res) => {
    const { name } = req.query;
    const result = aws.getS3Credentials(name);

    res.status(status).json(result);
  };
  get.apiDoc = {
    description: 'Get signed upload url',
    operationId: 'upload',
    tags: ['_user', 'write', 'aws'],
    parameters: [
      {
        in: 'query',
        name: 'name',
        schema: {
          type: 'string',
          example: 'somepicture.jpg',
        },
        required: true,
      },
    ],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Upload url successfully created.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                upload_url: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://carpedev-west.s3.amazonaws.com',
                },
                params: {
                  type: 'object',
                  properties: {
                    key: {
                      type: 'string',
                      description: 'Key the file was uploaded to',
                    },
                    acl: {
                      type: 'string',
                      example: 'public-read',
                      description: 'ACL of the object uploaded',
                    },
                    success_action_status: {
                      type: 'string',
                      example: '201',
                      description: 'Internal service code requested',
                    },
                    policy: {
                      type: 'string',
                      example:
                        'eyJleHBpcmF0aW9uIjoiMjAxOS0wMi0yNFQyMTo1MjowOC42MzFaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiY2FycGVkZXYtd2VzdCJ9LHsia2V5IjoicmF3L3VuZGVmaW5lZCJ9LHsiYWNsIjoicHVibGljLXJlYWQifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTAwMDAwMDBdLHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJUDNGUzRJUExQMkhOUkVRLzIwMTkwMjI0L3VzLXdlc3QtMi9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWRhdGUiOiIyMDE5MDIyNFQwMDAwMDBaIn1dfQ==',
                      description:
                        'Policy required in the header for the multipart file upload',
                    },
                    'x-amz-algorithm': {
                      type: 'string',
                      example: 'AWS4-HMAC-SHA256',
                      description: 'Meta data about the signed upload policy',
                    },
                    'x-amz-credential': {
                      type: 'string',
                      example:
                        'AKIAIP3FS4IPLP2HNREQ/20190225/us-west-2/s3/aws4_request',
                      description: 'Meta data about the signed upload policy',
                    },
                    'x-amz-date': {
                      type: 'string',
                      example: '20190225T000000Z',
                      description: 'Meta data about the signed upload policy',
                    },
                    'x-amz-signature': {
                      type: 'string',
                      example:
                        '31886490662a565f35c2690a64b469dfa7fdea5985cad6b2bf55cd140981cb04',
                      description: 'Meta data about the signed upload policy',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return { get };
}
