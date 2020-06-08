const path = require('path');
const requestLogger = require('koa-logger');
const serve = require('koa-static');
const mount = require('koa-mount');
const views = require('koa-views');
const handlebars = require('handlebars');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const qs = require('koa-qs');

const config = require('config');
// const hmr = require('hmr');
const logger = require('logger');

const routes = require('./routes');


const pathToViews = path.join(__dirname, './../../client/views');
const pathToStatic = path.join(__dirname, './../../client/static');
handlebars.registerHelper('json', (context) => JSON.stringify(context));


const getArray = (obj) => {
  if (!obj) {
    return [];
  }

  if (obj instanceof Array) {
    return obj;
  }

  return [obj];
};

const routeErrorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status < 400 || ctx.status >= 500) {
      logger.error(err);
      ctx.body = {
        errors: [{ _global: 'An error has occurred' }],
      };
      ctx.app.emit('error', err, ctx);
    } else {
      const errors = getArray(ctx.errors);

      const { message } = err;
      const messages = Object.keys(err).map((key) => ({ [key]: err[key] }));

      if (!ctx.body) {
        if (errors.length + messages.length) {
          ctx.body = {
            errors: [...errors, ...messages],
          };
        } else {
          ctx.body = message;
        }
      }

      logger.error(ctx.body);
    }
  }
};

module.exports = async (app) => {
  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
  app.use(requestLogger());

  app.use(mount('/static', serve(pathToStatic)));
  app.use(views(config.isDev ? pathToViews : pathToStatic, {
    default: 'html',
    map: { html: 'handlebars' },
    options: {
      helpers: {
        json: (ctx) => JSON.stringify(ctx),
      },
    },
  }));

  validate(app);

  app.use(routeErrorHandler);

  routes(app);
};
