require("dotenv").config();
const http = require('http');

const connectMongoDb = require("./services/mongoose");
const SocketService = require('./services/socketService');

const { PORT = 8000 } = process.env || {};
// Package Import and variable initializations

//Database Connection and Socket Initialization
const db = connectMongoDb();

db.on('error', (err) => {
  console.log('Mongoose error', err);
});

db.once('open', async () => {
  const setupExpress = require('./services/express');
  const app = setupExpress();
  const server = http.createServer(app);

  const socketService = new SocketService(server);
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
  });

  console.log(`Connected to DB!`);
});
