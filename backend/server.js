require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const commandRoutes = require("./routes/commandRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

connectDB();

app.use(express.json());
app.use("/api/commands", commandRoutes);

// WebSocket connexion
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.set("io", io);
