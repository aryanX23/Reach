const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUser, logOut, loginUser, checkLoggedIn } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUser);
  router.route('/login').post(loginUser);
  router.route('/checkAuth').post(checkLoggedIn);
  router.route('/logout').post(logOut);

  return router
};