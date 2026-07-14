"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * A custom hook to manage the client-side Socket.IO connection.
 * It ensures a single, persistent connection is used across the application.
 *
 * @returns The active Socket.IO instance, or null if not connected.
 */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket?.connected || false);

  useEffect(() => {
    if (socket?.connected) return;

    // The path must match the one configured on the server.
    socket = io({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  return { socket, isConnected };
};
