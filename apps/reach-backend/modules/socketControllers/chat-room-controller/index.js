const kafkaService = require("../../../services/kafkaService");

const chatRoomSocketNamespaceController = async (chatRoomSocketNamespace) => {
  try {
    chatRoomSocketNamespace.on("connection", (socket) => {
      console.log("New Chat Room Connection established -> ", socket.id);

      socket.on("join-room", (data = {}) => {
        console.log("Joining personal notification channel -> ", data);
        const { userId = "" } = data;
        socket.join(userId);
      });

      socket.on("leave-room", (data = {}) => {
        console.log("Leaving personal notification channel -> ", data);
        const { userId = "" } = data;
        socket.leave(userId);
      });

      socket.on("send-notification", (data = {}) => {
        socket.to(data.userId).emit("receive-notification", data?.content || {});
      });

      socket.on("join-chat-room", (data = {}) => {
        console.log("Joining chat room -> ", data);
        socket.join(data.roomId);
      });

      socket.on("leave-chat-room", (data = {}) => {
        console.log("Leaving chat room -> ", data);
        socket.leave(data.roomId);
      });

      socket.on("send-chat-message", (data = {}) => {
        socket.to(data.roomId).emit("receive-chat-message", data?.content || {});
        kafkaService.sendMessage("chat-messages", data.content, data.roomId);
      });
    });

    chatRoomSocketNamespace.on("disconnect", (socket) => {
      console.log("Chat Room Socket Disconnected -> ", socket.id);
    });
  } catch (error) {
    console.log("Error in Chat Room Socket Namespace handler -> \n", error);
  }
};

module.exports = chatRoomSocketNamespaceController;
