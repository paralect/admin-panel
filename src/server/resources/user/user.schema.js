const { USER_ROLES } = require('app.constants');

const userSchema = {
  $jsonSchema: {
    required: ['firstName', 'lastName', 'email', 'oauth', 'isEmailVerified'],
    properties: {
      _id: {
        bsonType: 'string',
      },
      createdOn: {
        bsonType: 'date',
      },
      updatedOn: {
        bsonType: 'date',
      },
      firstName: {
        bsonType: 'string',
      },
      lastName: {
        bsonType: 'string',
      },
      email: {
        bsonType: 'string',
        pattern: '^.+@.+\\..+$',
      },
      passwordHash: {
        bsonType: 'string',
      },
      signupToken: {
        bsonType: 'string',
      },
      resetPasswordToken: {
        bsonType: 'string',
      },
      isEmailVerified: {
        bsonType: 'bool',
      },
      oauth: {
        bsonType: 'object',
        required: ['google'],
        properties: {
          google: {
            bsonType: 'bool',
          },
        },
      },
      lastRequest: {
        bsonType: 'date',
      },
      roles: {
        bsonType: 'array',
        items: {
          enum: Object.values(USER_ROLES),
        },
      },
    },
  },
};

module.exports = userSchema;
