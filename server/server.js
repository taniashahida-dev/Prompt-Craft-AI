const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load Environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// CORS config - allow calls from Next.js frontends (default port 3000)
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow any origin dynamically to satisfy credentials: true
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Initialize Passport
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

// Main base health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PromptCraft AI API Backend is running."
  });
});

// Route mountings
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/prompts", require("./routes/promptRoutes"));
app.use("/api/templates", require("./routes/templateRoutes"));

// Catch-all route for undefined paths
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested API endpoint not found."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
