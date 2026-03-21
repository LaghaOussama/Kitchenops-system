const express = require("express");
const router = express.Router();
const Command = require("../models/Command");

// CREATE
router.post("/", async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!tableNumber) {
      return res.status(400).json({
        message: "tableNumber is required",
      });
    }
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const command = new Command(req.body);
    const saved = await command.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  const commands = await Command.find();
  res.json(commands);
});

// UPDATE STATUS
router.put("/:id/status", async (req, res) => {
  const { status } = req.body || {};
  const updated = await Command.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.json(updated);
});

module.exports = router;
