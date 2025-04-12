const { Server } = require('socket.io');

const { ORIGIN_URL = 'http://localhost:3000' } = process.env || {};

class SocketService {
  _io = null;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: [ORIGIN_URL],
      },
    });
    console.log('Socket Init Successful...');
  }

  getIO() {
    return this._io;
  }

  initListeners() {
    const io = this._io;
    console.log('Initializing Socket Listeners..');

    io.on('connection', (socket) => {
      console.log('User connected', socket.id);

    });
  }
}

module.exports = SocketService;

