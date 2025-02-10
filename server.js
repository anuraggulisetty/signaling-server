const express = require("express");
const fs = require("fs");
const https = require("https");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Load SSL Certificates
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Create HTTPS server instead of HTTP
const server = https.createServer(options, app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Change this to your frontend URL if needed
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("offer", (data) => {
    socket.to(data.target).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.target).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.target).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Secure server running on https://localhost:${PORT}`));
