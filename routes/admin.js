const express = require("express");
const router = express.Router();
const User = require("../models/User");
const DailyRound = require("../models/DailyRound");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/auth");


// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all japa records
router.get("/rounds", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const rounds = await DailyRound.find().populate("userId", "email role");
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Promote/demote user
router.put(
  "/user/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body; // 'admin' or 'user'
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
