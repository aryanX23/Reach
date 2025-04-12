const express = require('express');
const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const conversationRoutes = require('./modules/conversations/conversationRoutes');
const messageRoutes = require('./modules/messages/messageRoutes');
const userRoutes = require('./modules/users/userRoutes');

module.exports = () => router
  .use('/users', userRoutes())
  .use('/messages', messageRoutes())
  .use('/conversations', conversationRoutes())
  .get('/', (req, res) => {
    console.log('All routes are online!');
    res.status(200).send('Server is Up and Running!');
  })
  .all('*', (req, res) => {
    console.log('Route Does not exist!');
    res.sendStatus(404);
  });
