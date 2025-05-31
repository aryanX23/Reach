const { User, Conversation, Message } = require('../../models');

async function createConversation(req, res) {
  try {
    const { senderId, receiverId } = req.body;
    // const checkExists = await User.findById(receiverId);
    const isPresent = await Conversation.find();
    if (isPresent.length !== 0) {
      for (let i = 0; i < isPresent.length; i++) {
        const members = isPresent[i].members;
        if ((members[0] === senderId && members[1] === receiverId) || (members[0] === receiverId && members[1] === senderId)) {
          res.send('User Already Exists!');
          return;
        }
      }
    }
    const newConversation = new Conversation({ members: [senderId, receiverId] });
    await newConversation.save();
    const newMessage = new Message({ conversationId: newConversation._id, data: [] });
    await newMessage.save();
    res.status(200).send('New Conversation created successfully!');
  }
  catch (e) {
    console.log('An Error has occured in the createConversation route!', e);
    res.status(200).send('Id does not exists!!');
    return;
  }
}

const getActiveConversations = async (req, res) => {
  try {
    const { userId = "" } = req.userDetails;
    const conversations = await Conversation.find({ members: { $in: userId }, status: "active" }).lean() || [];

    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find((member) => member !== userId);
        const receiverDetails = await User.findOne({ userId: receiverId }).lean() || {};
        return { user: { email: receiverDetails.email, fullName: receiverDetails.name, userId: receiverId }, conversationId: conversation.conversationId };
      }),
    );
    res.status(200).json({ status: "success", data: conversationUserData });
  } catch (error) {
    console.error('Error fetching active conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createConversation,
  getActiveConversations
};