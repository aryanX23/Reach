const SocketService = require('./socketService');
const connectDatabase = require('./mongoose');
const setupExpress = require('./express');

module.exports = { SocketService, connectDatabase, setupExpress };
