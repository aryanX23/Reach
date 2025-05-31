const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { createConversation, getActiveConversations } = require('./conversationController');

module.exports = () => {

  router.route('/').post(createConversation);
  router.route('/get-active-conversations').get(getActiveConversations);

  return router;
};