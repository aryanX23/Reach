const { Conversation } = require("../models");
const { getId } = require("./generateId");

const createConversationRoom = async (options) => {
  const { members = [], type = "", groupName } = options;

  const conversationId = getId("CONVERSATION");

  const newConversationPayload = {
    conversationId,
    members,
    type,
    status: 'active',
    groupName,
  };

  await Conversation.create(newConversationPayload);
};

module.exports = {
  createConversationRoom,
};

