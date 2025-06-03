const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const roundRoutes = require("./routes/rounds");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rounds", roundRoutes);
module.exports = app;
