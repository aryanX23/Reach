const { Server } = require("socket.io");
const { Redis } = require('ioredis');
const { createAdapter } = require("@socket.io/redis-adapter");

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  connectTimeout: 10000,
  lazyConnect: true,
  autoResubscribe: true,
  autoResendUnfulfilledCommands: true,
  enableOfflineQueue: true,
  reconnectOnError: (err) => {
    console.error("Redis connection error:", err);
    return true; // Reconnect on error
  },
});
const subClient = redisClient.duplicate();
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});
redisClient.on("connect", () => {
  console.log("Redis Client Connected Successfully");
});

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
      adapter: createAdapter(redisClient, subClient),
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
