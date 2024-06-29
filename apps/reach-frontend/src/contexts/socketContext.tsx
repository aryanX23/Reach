'use client'
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
const { VITE_SERVER_URL } = import.meta.env || {};

const SocketContext = React.createContext(null);

interface SocketProviderProps{
  children?: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  
  useEffect(() => {
    const socket = io(VITE_SERVER_URL);

    return () => {
      socket.disconnect();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={null}>
      {children}
    </SocketContext.Provider>
  );
}