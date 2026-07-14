const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const userRouter = require("./routes/userRoutes");
const socketio = require("socket.io");
const socketIo = require("./socket");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB has been connected");
  })
  .catch((err) => {
    console.log("Failed MongoDB connection", err.message);
  });

// Initialize socket
socketIo(io);

// Routes
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/messages", messageRouter);

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
