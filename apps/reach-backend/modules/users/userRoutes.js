const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUsers, logOut, loginUsers, checkLoggedIn } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUsers);
  router.route('/login').post(loginUsers);
  router.route('/checkAuth').post(checkLoggedIn);
  router.route('/logout').post(logOut);

  return router
};