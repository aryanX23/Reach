const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUser, loginUser, checkLoggedIn } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUser);
  router.route('/login').post(loginUser);

  return router
};