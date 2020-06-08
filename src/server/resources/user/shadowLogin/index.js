const { SHADOW_COOKIES } = require('app.constants');
const authService = require('services/auth.service');
const userService = require('resources/user/user.service');

const handler = async (ctx) => {
  const user = await userService.findOne({ _id: ctx.params.id });

  await authService.setTokens(ctx, {
    userId: user._id,
    isShadow: true,
    cookies: SHADOW_COOKIES,
  });

  ctx.body = {};
};

module.exports.register = (router) => {
  router.post('/:id/shadow-login', handler);
};
