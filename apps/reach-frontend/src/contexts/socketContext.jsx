import React, { useMemo } from "react";
import { isEmpty } from "lodash";
import { useEffect, useContext, useState, createContext } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const { VITE_SERVER_URL } = import.meta.env || {};
const SocketContext = createContext(null);

export const SocketProvider = ({ children, namespace = "/", rooms = [] }) => {
  const [socket, setSocket] = useState(null);
  const url = VITE_SERVER_URL + namespace;

  useEffect(() => {
    if (isEmpty(rooms)) {
      return;
    }

    const newSocket = io(url, {
      withCredentials: true
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-room", { rooms: rooms });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      newSocket.emit("leave-room", { rooms: rooms });
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
      newSocket.emit("leave-room", { rooms: rooms });
      newSocket.disconnect();
    };
  }, [url, rooms]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
