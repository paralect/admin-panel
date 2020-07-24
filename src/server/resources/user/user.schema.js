const Joi = require('@hapi/joi');

const { USER_ROLES } = require('app.constants');

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  passwordHash: Joi.string()
    .allow(null),
  signupToken: Joi.string()
    .allow(null),
  resetPasswordToken: Joi.string()
    .allow(null),
  isEmailVerified: Joi.boolean()
    .default(false),
  oauth: Joi.object()
    .keys({
      google: Joi.boolean().default(false),
    })
    .required(),
  lastRequest: Joi.date(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(USER_ROLES))),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
