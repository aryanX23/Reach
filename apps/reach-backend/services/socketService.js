const { Server } = require('socket.io');

class SocketService{
  _io = null;

  constructor(server) {
    this._io = new Server(server);
    console.log('Socket Init Successful...');
  }

  getIO() {
    return this._io;
  }
}

module.exports = SocketService;

