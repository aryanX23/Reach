const { Message } = require("../../models");

async function getMessage(req, res) {
  try {
    const conversationId = req.params.id;
    const Message = await Message.findOne({ conversationId });
    res.send(Message);
  } catch (e) {
    console.log("An Error has occured in the getMessage route!", e);
  }
}

async function setMessage(req, res) {
  const { conversationId, senderId, message } = req.body;
  try {
    const obj = { senderId: senderId, message: message };
    await Message.findOneAndUpdate(
      { conversationId: conversationId },
      { $push: { data: obj } },
    );
    res.send("Message Saved successfully");
  } catch (e) {
    console.log("Error occured in setMessage route!", e);
  }
}

module.exports = {
  getMessage,
  setMessage,
};
