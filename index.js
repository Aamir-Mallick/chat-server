const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://tender-minsky-ab4704.netlify.app/",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("welcome");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    io.in(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data.room);
    socket.emit("user_left", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log("server is running");
});
