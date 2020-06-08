const Router = require('@koa/router');


const router = new Router();

require('./logout').register(router);
require('./signin').register(router);

module.exports = router.routes();
