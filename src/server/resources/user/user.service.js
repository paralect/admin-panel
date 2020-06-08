const _ = require('lodash');

const db = require('db');
const constants = require('app.constants');

const schema = require('./user.schema');


const service = db.createService(constants.DATABASE_DOCUMENTS.USERS, schema);

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

service.getPublic = (user) => {
  return _.omit(user, privateFields);
};

module.exports = service;
