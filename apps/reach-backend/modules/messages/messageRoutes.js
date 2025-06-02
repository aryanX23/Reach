const Router = require("express-promise-router");
const router = Router({ mergeParams: true });

const { setMessage, getMessage } = require("./messageController");

// Message routes
router.get("/", (req, res) => {
  res.json({ message: "Get all messages" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get message ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.json({ message: "Create message" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: `Delete message ${req.params.id}` });
});

router.route("/get/:id").get(getMessage);
router.route("/set").post(setMessage);

module.exports = () => {
  return router;
};
