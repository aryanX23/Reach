const express = require('express');

const masterRouter = express.Router();

const conversationRoutes = require('./modules/conversations/conversationRoutes.js');
const messageRoutes = require('./modules/messages/messageRoutes.js');
const userRoutes = require('./modules/users/userRoutes.js');

module.exports = () => masterRouter
  .use('/users', userRoutes())
  .use('/messages', messageRoutes())
  .use('/conversations', conversationRoutes())
  .get('/', (req, res) => {
    console.log("All routes are online!");
    res.status(200).send("Server is Up and Running!");
  }).all('*', (req, res) => {
    // eslint-disable-next-line no-undef
    console.log("Route Does not exist!");
    res.sendStatus(404);
  });
