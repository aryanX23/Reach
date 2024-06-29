const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const { setMessage, getMessage } = require('./messageController');

module.exports = () => {

  router.route('/get/:id').get(getMessage);
  router.route('/set').post(setMessage);

  return router
};