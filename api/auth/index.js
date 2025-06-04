const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("../../routes/auth");
const connectDB = require("../../lib/db");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
