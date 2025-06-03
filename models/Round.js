const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    count: { type: Number, required: true }, // Final count in round
    duration: { type: Number, required: true }, // Duration in seconds
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Round", roundSchema);
