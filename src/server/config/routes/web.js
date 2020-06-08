const Router = require('@koa/router');

const config = require('config');


const indexRouter = new Router();

indexRouter.get(/^(?!\/?api).*$/, async (ctx) => {
  return ctx.render(config.isDev ? 'index-template' : 'index', {
    isDev: config.isDev,
    hotUrl: config.hotUrl,
    config: {
      apiUrl: config.apiUrl,
      webUrl: config.webUrl,
      adminApiUrl: config.adminApiUrl,
    },
  });
});

module.exports = indexRouter.routes();
