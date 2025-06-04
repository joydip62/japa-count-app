require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const roundRoutes = require("./routes/rounds");


const app = express();

// Middleware
// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // or "*" for open access
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === "https://japa-counter-app-client.onrender.com"
      ) {
        // allow requests from localhost (dev) or file:// (Electron app)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello from backend server.js" });
});

app.use(express.json()); // Needed to parse JSON bodies

// Use the auth routes
app.use("/api/auth", authRoutes);

// Use the User Daily Round
app.use("/api/rounds", roundRoutes); 

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
