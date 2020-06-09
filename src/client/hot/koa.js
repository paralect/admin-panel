const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const webpackConfig = require('../webpack.dev.config');


const hmr = () => {
  // workaround for docker containers
  const host = process.env.HRM_HOST || 'localhost';

  return koaWebpack({
    compiler: webpack(webpackConfig),
    hotClient: {
      host,
      port: 8083,
      validTargets: ['node'],
    },
    devMiddleware: {
      publicPath: webpackConfig.output.publicPath,
    },
  });
};

module.exports = async (app) => {
  const middleware = await hmr();
  app.use(middleware);
};
