const mount = require('koa-mount');

const accountResource = require('resources/account/public');
const healthResource = require('resources/health/public');


module.exports = (app) => {
  app.use(mount('/api/account', accountResource));
  app.use(mount('/api/health', healthResource));
};
