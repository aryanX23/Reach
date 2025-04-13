const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { registerUser, loginUser, handleFriendRequest, getPendingFriendRequests, acceptFriendRequest, rejectFriendRequest } = require('./userController');

module.exports = () => {

  router.route('/register').post(registerUser);
  router.route('/login').post(loginUser);
  router.route('/send-friend-request').get(handleFriendRequest);
  router.route('/pending-friend-requests').get(getPendingFriendRequests);
  router.route('/accept-friend-request').get(acceptFriendRequest);
  router.route('/reject-friend-request').get(rejectFriendRequest);


  return router;
};