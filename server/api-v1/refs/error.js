const error = {
  type: 'object',

  properties: {
    status: {
      type: 'integer',
      example: 420,
      description: 'HTTP status code of response',
    },
    message: {
      type: 'string',
      example: "Oops, that's not right",
      description: 'Human readable explanation of error',
    },
    errors: {
      description: 'Array of errors that provide explanation',
      type: 'array',
      items: {
        description: 'Explanatory error object',
        type: 'object',
        properties: {
          type: {
            description: 'Coded error type',
            type: 'string',
            example: 'openapi.validation.error',
          },
          message: {
            description: 'Human readable error message',
            type: 'string',
            example: 'request body should have x',
          },
        },
      },
    },
  },
};

export const commonErrors = {
  400: {
    description: 'Bad requestBody or malformed request parameters.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  401: {
    description: 'User was unauthenticated.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  403: {
    description: 'User was unauthorized to perform this operation.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  404: {
    description: 'Requested resource was not found.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  422: {
    description: 'Request was not processable in the service handler.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  500: {
    description: 'Request failed due to an unkown error.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
};

export default error;
