const mongoose = require("mongoose");
const User = require("./User");

const dailyRoundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User, // optional: link to your User model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
  },

  roundCount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
});

module.exports = mongoose.model("DailyRound", dailyRoundSchema);
