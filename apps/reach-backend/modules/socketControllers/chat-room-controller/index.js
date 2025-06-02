const chatRoomSocketNamespaceController = async (chatRoomSocketNamespace) => {
  try {
    chatRoomSocketNamespace.on("connection", (socket) => {
      console.log("New Chat Room Connection established -> ", socket.id);

      socket.on("join-room", (data) => {
        console.log("Joining room -> ", data);
        socket.join(data.roomId);
      });

      socket.on("leave-room", (data) => {
        console.log("Leaving room -> ", data);
        socket.leave(data.roomId);
      });

      socket.on("send-message", (data) => {
        socket.to(data.roomId).emit("receive-message", data?.content || {});
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
