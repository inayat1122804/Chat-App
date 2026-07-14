import { io } from "socket.io-client";

const ENDPOINT = "https://chat-app-e0nj.onrender.com";
let socketInstance = null;

export const getSocketInstance = (userInfo) => {
  if (socketInstance) {
    return socketInstance;
  }

  const auth = userInfo ? { user: userInfo } : undefined;
  socketInstance = io(ENDPOINT, {
    auth,
  });

  return socketInstance;
};
