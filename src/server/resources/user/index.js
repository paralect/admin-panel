const Router = require('@koa/router');


const router = new Router();

require('./get').register(router);
require('./get-current').register(router);
require('./shadow-login').register(router);

module.exports = router.routes();
