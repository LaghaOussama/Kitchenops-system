require("dotenv").config();
const express = require("express");
const app = express();

const commandRoutes = require("./routes/commandRoutes");
app.get("/", (req, res) => {
  res.send("KitchenOps running");
});

const connectDB = require("./config/db");

connectDB();
//console.log(process.env.MONGO_URI); For debug to check if env variable is loaded
app.use("/api/commands", commandRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
