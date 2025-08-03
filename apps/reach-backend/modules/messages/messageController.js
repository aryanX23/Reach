const { isEmpty } = require("lodash");
const { Message, Conversation } = require("../../models");

const getMessage = async (req, res) => {
  try {
    const { userId } = req.userDetails || {};
    const { conversationId, messageRange, messageFetchDirection, lastMessageTimestamp } = req.query || {};

    // Checking If User is part of the conversation and conversation exists
    const conversationValidation = await Conversation.findOne({
      conversationId,
    }).lean() || {};

    if (isEmpty(conversationValidation)) {
      return res.status(404).send({ success: false, errorMessage: "Conversation does not exists", errorCode: "CONVERSATION_NOT_FOUND" });
    }

    if (!conversationValidation.members.includes(userId)) {
      return res.status(403).send({ success: false, errorMessage: "Forbidden Conversation", errorCode: "FORBIDDEN_CONVERSATION" });
    }

    let fetchTillTime = "";
    switch (messageRange) {
      case '24_hour':
        fetchTillTime = (messageFetchDirection === 'older') ? new Date(Date.now() - 24 * 60 * 60 * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
        break;
      case 'today':
        fetchTillTime = new Date(new Date().setHours(0, 0, 0, 0));
        break;
      case 'week':
        fetchTillTime = (messageFetchDirection === 'older') ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        fetchTillTime = (messageFetchDirection === 'older') ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        fetchTillTime = ""; // No limit, fetch all messages
        break;
    }

    // Fetching messages based on the provided parameters
    if (lastMessageTimestamp) {
      const lastMessageTime = new Date(lastMessageTimestamp);
      if (isNaN(lastMessageTime.getTime())) {
        return res.status(400).send({ success: false, errorMessage: "Invalid last message timestamp", errorCode: "INVALID_TIMESTAMP" });
      }
      let messageList = [];

      if (messageFetchDirection === 'newer') {
        messageList = await Message.find({
          conversationId,
          messageTime: {
            $gt: lastMessageTime,
            ...(
              isEmpty(fetchTillTime) ? {} : { $lte: fetchTillTime }
            ),
          },
        }).lean().sort({ messageTime: 1 }).select("message senderId type status messageTime messageTimezone") || [];
      } else {
        messageList = await Message.find({
          conversationId,
          messageTime: {
            $lt: lastMessageTime,
            ...(
              isEmpty(fetchTillTime) ? {} : { $gte: fetchTillTime }
            ),
          },
        }).lean().sort({ messageTime: 1 }).select("message senderId type status messageTime messageTimezone") || [];
      }

      return res.status(200).send({
        success: true,
        data: {
          messages: messageList.map((message) => ({
            content: message.message,
            sender: (userId === message.senderId) ? "self" : "other",
            time: message.messageTime,
            timezone: message.messageTimezone,
            senderId: message.senderId,
          })),
          conversationId,
          messageRange,
          messageFetchDirection,
          lastMessageTimestamp
        },
      });
    }

    const messageList = await Message.find({
      conversationId,
      ...(isEmpty(fetchTillTime) ?
        {} :
        {
          messageTime: {
            ...(messageFetchDirection === 'newer' ? { $lte: fetchTillTime } : { $gte: fetchTillTime }),
          }
        }
      ),
    }).lean().sort({ messageTime: 1 }).select("message senderId type status messageTime messageTimezone") || [];

    return res.status(200).send({
      success: true,
      data: {
        messages: messageList?.map((message) => {
          return {
            content: message.message,
            sender: (userId === message.senderId) ? "self" : "other",
            time: message.messageTime,
            timezone: message.messageTimezone,
            senderId: message.senderId,
          };
        }),
        conversationId,
        messageRange,
        messageFetchDirection,
        lastMessageTimestamp
      },
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  getMessage,
};
