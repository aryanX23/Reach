const { Server } = require("socket.io");

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";

const { chatRoomSocketNamespaceController} = require("../modules/socketControllers");

module.exports = class SocketService {
  _io;
  socketRouteMap;

  constructor(server) {
    this._io = new Server(server, {
      cors: {
        origin: [ORIGIN_URL],
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: false,
      },
      transports: ["websocket", "polling"],
      allowEIO3: true,
    });

    // Instantiating Namespaces Route Map
    this.socketRouteMap = {
      "chat-room": this._io.of("/chat-room"),
    };
    console.log("Socket Init Successful...");
  }

  getIO() {
    return this._io;
  }

  getSocketRouteMap(
    routeKey
  ) {
    return this.socketRouteMap[routeKey];
  }

  async initListeners() {
    console.log("Initializing Socket Listeners..");

    // Initializing Socket Listeners
    await chatRoomSocketNamespaceController(this.getSocketRouteMap("chat-room"));
  }
}
