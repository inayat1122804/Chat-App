import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
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
