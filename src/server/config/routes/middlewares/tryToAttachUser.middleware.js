const userService = require('resources/user/user.service');
const tokenService = require('resources/token/token.service');

const tryToAttachUser = async (ctx, next) => {
  let data;

  if (ctx.state.accessToken) {
    data = await tokenService.getUserDataByToken(ctx.state.accessToken);
  }

  if (data) {
    ctx.state.user = await userService.findOne({ _id: data.userId });
  }

  return next();
};

module.exports = tryToAttachUser;
