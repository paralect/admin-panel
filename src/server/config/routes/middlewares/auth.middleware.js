const { USER_ROLES } = require('app.constants');

const auth = (ctx, next) => {
  if (ctx.state.user && ctx.state.user.roles.includes(USER_ROLES.SUPER_ADMIN)) {
    return next();
  }

  ctx.status = 401;
  ctx.body = {};
  return null;
};

module.exports = auth;
