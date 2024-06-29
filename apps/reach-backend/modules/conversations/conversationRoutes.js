const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { createConversation, getConversationById } = require('./conversationController');

module.exports = () => {

  router.route('/:userId').get(getConversationById);
  router.route('/').post(createConversation);

  return router
};