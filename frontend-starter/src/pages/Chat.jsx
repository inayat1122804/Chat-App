import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import io from "socket.io-client";
import { useEffect, useState } from "react";
const ENDPOINT = "http://localhost:3000";

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(() => {
    const savedGroup = sessionStorage.getItem("selectedGroup");
    return savedGroup ? JSON.parse(savedGroup) : null;
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");
    if (!userInfo) return;
    const newSocket = io(ENDPOINT, {
      auth: { user: userInfo },
    });
    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      sessionStorage.setItem("selectedGroup", JSON.stringify(selectedGroup));
    } else {
      sessionStorage.removeItem("selectedGroup");
    }
  }, [selectedGroup]);

  return (
    <Flex h="100vh">
      <Box w="300px" borderRight="1px solid" borderColor="gray.200">
        <Sidebar setSelectedGroup={setSelectedGroup} />
      </Box>
      <Box flex="1">
        {socket && <ChatArea selectedGroup={selectedGroup} socket={socket} />}
      </Box>
    </Flex>
  );
};

export default Chat;
