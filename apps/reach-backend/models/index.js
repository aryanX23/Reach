const { User } = require('./userModel');
const { Conversation } = require('./conversationModel');
const { Message } = require('./messageModel');

const models = {
  User,
  Conversation,
  Message
};

global.models = models;

module.exports = models;