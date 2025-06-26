import React, { useMemo } from "react";
import { isEmpty } from "lodash";
import { useEffect, useContext, useState, createContext } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setActiveConversation } from "@/store/slices/conversationSlices";

const { VITE_SERVER_URL } = import.meta.env || {};
const SocketContext = createContext(null);

export const SocketProvider = ({ children, namespace = "/", userId = "" }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const url = VITE_SERVER_URL + namespace;

  useEffect(() => {
    if (isEmpty(userId)) {
      return;
    }

    const newSocket = io(url, {
      withCredentials: true
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-room", { userId: userId });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      newSocket.emit("leave-room", { userId: userId });
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
      newSocket.emit("leave-room", { userId: userId });
      newSocket.disconnect();
      dispatch(setActiveConversation(null));
    };
  }, [url, userId, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
