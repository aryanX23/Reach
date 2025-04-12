const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { createConversation, getConversationById } = require('./conversationController');

// Conversation routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all conversations' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get conversation ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create conversation' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete conversation ${req.params.id}` });
});

router.route('/:userId').get(getConversationById);
router.route('/').post(createConversation);

module.exports = () => {
  return router;
};