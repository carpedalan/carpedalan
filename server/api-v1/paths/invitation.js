import SES from 'aws-sdk/clients/ses';

import { AWSError } from '../../errors';
import { commonErrors } from '../refs/error';
// import { awsRegion } from '../../server/config';

const ses = new SES({
  region: 'us-west-2',
});

const status = 200;

const invitation = () => {
  const post = async (req, res) => {
    const { email, firstName, lastName } = req.body;
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
            Data: `${firstName} ${lastName} with email: ${email} requested access.`,
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
      Source: 'leifdalan@gmail.com' /* required */,
      ReplyToAddresses: [
        'no-reply@farts.com',
        /* more items */
      ],
    };
    console.log(params, 'params'); // eslint-disable-line
    try {
      const promise = ses.sendEmail(params).promise();
      console.log('promise', promise); // eslint-disable-line
      const receipt = await promise;
      console.log('receipt', receipt); // eslint-disable-line
      res.status(200).json(receipt);
    } catch (e) {
      console.log('error', e); // eslint-disable-line
      res.status(500).send();
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
            required: ['email'],
            properties: {
              firstName: {
                description: 'Fist Name',
                type: 'string',
                example: 'Jay',
              },
              lastName: {
                description: 'Last Name',
                type: 'string',
                example: 'Inslee',
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
