const Joi = require('@hapi/joi');

const { USER_ROLES } = require('app.constants');
const securityUtil = require('security.util');
const validate = require('middlewares/validate');
const authService = require('services/auth.service');
const userService = require('resources/user/user.service');


const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

async function validator(ctx, next) {
  const { email, password } = ctx.validatedData;

  const user = await userService.findOne({ email, roles: { $in: [USER_ROLES.SUPER_ADMIN] } });
  if (!user) {
    ctx.body = {
      errors: {
        credentials: ['Incorrect email or password'],
      },
    };
    ctx.throw(400);
  }

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);

  if (!isPasswordMatch) {
    ctx.body = {
      errors: {
        credentials: ['Incorrect email or password'],
      },
    };
    ctx.throw(400);
  }

  if (!user.isEmailVerified) {
    ctx.body = {
      errors: {
        email: ['Please verify your email to sign in'],
      },
    };
    ctx.throw(400);
  }

  ctx.validatedData.user = user;

  await next();
}

const handler = async (ctx) => {
  const { user } = ctx.validatedData;

  await authService.setTokens(ctx, { userId: user._id });

  ctx.body = userService.getPublic(user);
};

module.exports.register = (router) => {
  router.post('/signin', validate(schema), validator, handler);
};
