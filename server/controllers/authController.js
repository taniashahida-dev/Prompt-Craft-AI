const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { seedDemoTemplates } = require("../utils/seedTemplates");

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d"
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields." });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email." });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields." });
    }

    // Special check for Demo user auto-creation
    if (email === "demo@promptcraft.ai") {
      let demoUser = await User.findOne({ email });
      if (!demoUser) {
        demoUser = await User.create({
          name: "Demo Creator",
          email: "demo@promptcraft.ai",
          password: "demopass123"
        });
      }
      await seedDemoTemplates(demoUser._id);
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Check password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth Callback handler
// @route   GET /api/auth/google/callback
// @access  Public
const googleOAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=Google authentication failed`);
    }

    const token = generateToken(req.user._id);

    // Redirect user back to Next.js frontend with the JWT token in query parameters
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?token=${token}`);
  } catch (error) {
    console.error("Google OAuth callback error:", error.message);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=Internal server error`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleOAuthCallback
};
