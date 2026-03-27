import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  const token = localStorage.getItem("premsetu_token");

  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        token
      }
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
