const Joi = require('helpers/joi.adapter');
const userService = require('resources/user/user.service');
const securityUtil = require('security.util');


const incorrectCredentials = 'Incorrect email or password.';

const schema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .required()
    .options({
      language: {
        string: { email: '!!Please enter a valid email address' },
        any: { empty: '!!Email is required' },
      },
    }),
  password: Joi.string()
    .trim()
    .required()
    .options({
      language: {
        string: {
          min: `!!${incorrectCredentials}`,
          max: `!!${incorrectCredentials}`,
        },
        any: { empty: '!!Password is required' },
      },
    }),
};

const validateFunc = async (signinData) => {
  const errors = [];

  const user = await userService.findOne({ email: signinData.email });

  if (!user) {
    errors.push({ credentials: incorrectCredentials });
    return {
      errors,
    };
  }

  const isPasswordMatch = await securityUtil.compareTextWithHash(
    signinData.password,
    user.passwordHash,
  );

  if (!isPasswordMatch) {
    errors.push({ credentials: incorrectCredentials });
    return {
      errors,
    };
  }

  if (!user.isEmailVerified) {
    errors.push({ email: 'Please verify your email to sign in' });
    return {
      errors,
    };
  }

  return {
    value: {
      userId: user._id,
    },
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
