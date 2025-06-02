import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useContext, useState, createContext } from "react";
import { io } from "socket.io-client";

const { VITE_SERVER_URL } = import.meta.env || {};
const SocketContext = createContext(null);

export const SocketProvider = ({ children, namespace = "/", roomId = "" }) => {
  const [socket, setSocket] = useState(null);
  const url = VITE_SERVER_URL + namespace;

  useEffect(() => {
    if (isEmpty(roomId)) {
      return;
    }

    const newSocket = io(url);

    newSocket.on("connect", () => {
      newSocket.emit("join-room", { roomId });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      newSocket.emit("leave-room", { roomId });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("connect_timeout", (err) => {
      console.error("Connection timeout:", err);
    });

    newSocket.on("reconnection_attempt", (attempt) => {
      console.log(`Reconnection attempt #${attempt}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leave-room", { roomId });
      newSocket.disconnect();
    };
  }, [url, roomId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
