require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const commandRoutes = require("./routes/commandRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

// Configuration CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-domain.com"]
      : [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
        ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Appliquer CORS à Express
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/commands", commandRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// WebSocket connexion
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Partager io avec les routes
app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
