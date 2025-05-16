require("dotenv").config();
const http = require('http');

const { connectDatabase, setupExpress, SocketService } = require('./services');

const { PORT = 8000 } = process.env || {};
// Package Import and variable initializations

//Database Connection and Socket Initialization
const db = connectDatabase();

db.on('error', (err) => {
  console.log('Mongoose error', err);
});

db.once('open', async () => {
  try {
    const app = setupExpress();
    const server = http.createServer(app);

    const socketService = new SocketService(server);
    socketService._io.attach(server);

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}!`);
    });

    console.log(`Connected to DB!`);
    socketService.initListeners();
  } catch (err) {
    console.log('Error in startup configuration ->', err);
    process.exit(1);
  }
});