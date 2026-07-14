const socketIo = (io) => {
  // store connected user with their room information using socket.id as their key
  const connectedUser = new Map();

  // handel new socket connections
  io.on("connection", (socket) => {
    // Get user from authentication
    const user = socket.handshake.auth.user;
    console.log("user connected", user?.username);
    //! START: join room Handler ==========
    socket.on("join room", (groupId) => {
      // Add socket to the specified room
      socket.join(groupId);
      // Store user and romm info in connectedUser map
      connectedUser.set(socket.id, { user, room: groupId });
      // get list of all user currently in the room
      const userInRoom = Array.from(connectedUser.values())
        .filter((u) => u.room === groupId)
        .map((u) => u.user);
      // Emit updated user list to all clients in the room
      io.in(groupId).emit("user in room", userInRoom);
      // Broadcast join notification to all other user in the room
      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user?.username} has joined`,
        user: user,
      });
    });
    //! END : Join room Hnadler

    //! START: Leave room Handler
    //   triggered when user manually leaves a room
    socket.on("leave room", (groupId) => {
      console.log(`${user?.username} leaving room:`, groupId);
      // Remove socket from the room
      socket.leave(groupId);
      if (connectedUser.has(socket.id)) {
        // Remove user from connected user and notify others
        connectedUser.delete(socket.id);
        socket.to(groupId).emit("user left", user?._id);
      }
    });
    //! END : Leave room Hnadler

    //! START: New Message Handler
    //   Triggered when user sends a new message
    socket.on("new message", (message) => {
      // Broadcast message to all other user in the room
      socket.to(message.groupId).emit("message received", message);
    });
    //! END : New Message Handler

    //! START: Disconnect Handler
    // triggered when user close the connection
    socket.on("disconnect", () => {
      if (connectedUser.has(socket.id)) {
        // get user's room info before removing
        const userData = connectedUser.get(socket.id);
        // Notify others in the room about user's departure
        socket.to(userData.room).emit("user left", user?._id);
        // remove user from connected users
        connectedUser.delete(socket.id);
      }
    });
    //! END : Disconnect Handler

    socket.on("typing", ({ groupId, username }) => {
      // Broadcast typing status to other users in the room
      socket.to(groupId).emit("user typing", { username });
    });

    socket.on("stop typing", ({ groupId }) => {
      // Broadcast stop typing status to other user in the room
      socket.to(groupId).emit("user stop typing", { username: user?.username });
    });
    // ! END : Typing Indicator
  });
};

module.exports = socketIo;
