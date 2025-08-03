const Router = require("express-promise-router");
const router = Router({ mergeParams: true });

const { getMessage } = require("./messageController");
const { validateGetMessage } = require("./validations");

router.route("/").get(validateGetMessage, getMessage);
// router.route("/set").post(setMessage);

module.exports = () => {
  return router;
};
