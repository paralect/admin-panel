const auth = require('./middlewares/auth.middleware');
const tryToAttachUser = require('./middlewares/tryToAttachUser.middleware');
const extractTokens = require('./middlewares/extractTokens.middleware');
const webRoutes = require('./web');
const publicRoutes = require('./public');
const authenticatedRoutes = require('./authenticated');


const defineRoutes = (app) => {
  app.use(webRoutes);

  app.use(extractTokens);
  app.use(tryToAttachUser);

  publicRoutes(app);

  app.use(auth);

  authenticatedRoutes(app);
};

module.exports = defineRoutes;
