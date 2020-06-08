const Router = require('@koa/router');


const router = new Router();

require('./get').register(router);
require('./getCurrent').register(router);
require('./shadowLogin').register(router);

module.exports = router.routes();
