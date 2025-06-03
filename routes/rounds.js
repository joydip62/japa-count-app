// const router = require("express").Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const { addRound, getUserRounds } = require("../controllers/roundController");

// router.post("/", authMiddleware, addRound); // Log a new round
// router.get("/", authMiddleware, getUserRounds); // Get user's round history

// module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const DailyRound = require("../models/DailyRound");


// router.post("/daily", authMiddleware, async (req, res) => {
//   const { userId, date, roundCount, duration } = req.body;

//   // Debug line:
//   console.log("req.user from token:", req.user);

//   // Proceed with saving daily data
//   res.status(200).json({ message: "Daily data saved." });
// });


router.post("/daily", authMiddleware, async (req, res) => {
  const { date, email, roundCount, duration } = req.body;
    
  try {
    const newDaily = new DailyRound({
      userId: req.user.id, // from decoded token
      date,
      email,
      roundCount,
      duration,
    });
    
    await newDaily.save();

    res.status(200).json({ message: "Daily data saved to DB." });
  } catch (err) {
    console.error("Error saving daily data:", err);
    res.status(500).json({ message: "Failed to save daily data." });
  }
});


// get history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
      const records = await DailyRound.find({ email }).sort({ date: -1 });
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: "Error fetching history" });
    }
  });

  // check todays data 
  router.get("/check-today", authMiddleware, async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const record = await DailyRound.findOne({
        email: req.user.email,
        date: { $gte: today },
      });

      res.json({ submitted: !!record });
    } catch (err) {
      console.error("Error checking today’s submission:", err);
      res.status(500).json({ message: "Error checking submission" });
    }
  });
  

module.exports = router;
