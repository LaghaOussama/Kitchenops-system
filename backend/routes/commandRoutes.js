const express = require("express");
const router = express.Router();
const Command = require("../models/Command");

// CREATE
router.post("/", async (req, res) => {
  const command = new Command(req.body);
  const saved = await command.save();
  res.json(saved);
});

// GET ALL
router.get("/", async (req, res) => {
  const commands = await Command.find();
  res.json(commands);
});

// UPDATE STATUS
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const updated = await Command.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.json(updated);
});

module.exports = router;
