const express = require("express");
const router = express.Router();
const Command = require("../models/Command");
const calculatePriority = require("../services/priorityService");
const auth = require("../middleware/auth");

router.get("/secure", auth, (req, res) => {
  res.send("Route protégée OK");
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!tableNumber) {
      return res.status(400).json({
        message: "tableNumber is required",
      });
    }

    const command = new Command(req.body);
    command.priority = calculatePriority(command);
    const saved = await command.save();
    const io = req.app.get("io");
    io.emit("newCommand", saved);

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ALL
router.get("/", auth, async (req, res) => {
  try {
    const commands = await Command.find().sort({ priority: -1, createdAt: -1 });
    res.json(commands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE STATUS (NOW PROTECTED)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "in_progress", "ready", "served"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Command.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Command not found" });
    }

    const io = req.app.get("io");
    io.emit("updateCommand", updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
