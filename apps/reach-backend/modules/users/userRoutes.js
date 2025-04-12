const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUser, loginUser, handleFriendRequest } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUser);
  router.route('/login').post(loginUser);
  router.route('/send-friend-request/:id').get(handleFriendRequest);

  return router;
};