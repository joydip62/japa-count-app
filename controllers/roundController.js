// const Round = require("../models/Round");
const DailyRound = require("../models/DailyRound");

exports.addRound = async (req, res) => {
  try {
    const { email, count, duration } = req.body;
    const round = await DailyRound.create({
      userId: req.user.id,
      email,
      count,
      duration,
    });
    res.status(201).json(round);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRounds = async (req, res) => {
  try {
    const email = req.user.email;
    // const rounds = await Round.find({ email: req.user.email }).sort({
    //   createdAt: -1,
    // });
    const rounds = await DailyRound.find({ email }).sort({ date: -1 });

    res.status(200).json(rounds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
    