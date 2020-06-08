const tokenService = require('resources/token/token.service');
const cookieHelper = require('helpers/cookie.helper');
const constants = require('app.constants');

exports.setTokens = async (ctx, { userId, isShadow = false, cookies = constants.COOKIES }) => {
  const res = await tokenService.createAuthTokens({ userId, isShadow });

  const options = {
    ctx,
    cookies,
    ...res,
  };

  cookieHelper.setTokenCookies(options);
};

exports.unsetTokens = async (ctx) => {
  await tokenService.removeAuthTokens(ctx.state.accessToken);
  cookieHelper.unsetTokenCookies(ctx);
};
