const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const authController = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");

// Register
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ error: "Email already exists" });

//     const user = new User({ username, email, password });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, JWT_SECRET);
//     res.json({
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.post("/register", authController.register);

// Login
router.post("/login", authController.login);
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, JWT_SECRET);
//     res.json({
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// profile


router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    email: req.user.email,
    role: req.user.role,
  });
});
module.exports = router;
