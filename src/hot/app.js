// allows require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname);
const Koa = require('koa');

const app = new Koa();
require('./koa')(app);

process.on('unhandledRejection', (reason, p) => {
  console.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

app.listen(3004, () => {
  console.warn('Hot server listening on 3004');
});

module.exports = app;
