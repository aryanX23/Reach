const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUser, loginUser, handleFriendRequest, getPendingFriendRequests } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUser);
  router.route('/login').post(loginUser);
  router.route('/send-friend-request').get(handleFriendRequest);
  router.route('/pending-friend-requests').get(getPendingFriendRequests);

  return router;
};