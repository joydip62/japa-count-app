const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const roundRoutes = require("./routes/rounds");
const connectDB = require("../../lib/db");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/rounds", roundRoutes); 

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};