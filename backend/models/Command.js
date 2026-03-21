const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in_progress", "ready", "served"],
      default: "pending",
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Command", commandSchema);
