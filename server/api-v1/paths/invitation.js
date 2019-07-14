import SES from 'aws-sdk/clients/ses';
import { AWSError } from 'aws-sdk';

import { commonErrors } from '../refs/error';

const ses = new SES();

const status = 200;

const invitation = () => {
  const post = async (req, res) => {
    const { email, name } = req.body;
    const params = {
      Destination: {
        ToAddresses: [
          'leifdalan@gmail.com',
          /* more items */
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `${name} with email: ${email} requested access.`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'Reqestsz',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Request to carpedalan.com',
        },
      },
      Source: '4dMiN@carpedalan.com' /* required */,
      ReplyToAddresses: [
        'no-reply@farts.com',
        /* more items */
      ],
    };
    try {
      const receipt = await ses.sendEmail(params).promise();
      res.status(200).json(receipt);
    } catch (e) {
      throw new AWSError(e);
    }
  };

  post.apiDoc = {
    description: 'User requested an invite',
    operationId: 'invitation',
    tags: ['_user'],
    requestBody: {
      description: 'Request body for invitation',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'Payload for invitation',
            required: ['name', 'email'],
            properties: {
              name: {
                description: 'Name',
                type: 'string',
                example: 'Jay Inslee',
              },
              email: {
                description: 'E-mail',
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [status]: {
        description: 'User successfully requested invitation',
      },
    },
    security: [],
  };
  return { post };
};

export default invitation;
