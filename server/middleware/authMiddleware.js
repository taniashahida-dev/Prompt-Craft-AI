const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Verify Bearer token format in Authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token value
      token = req.headers.authorization.split(" ")[1];

      // Decode token signatures
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user profile from database (exclude password field) and append to Request object
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User account not found." });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: "Not authorized, token validation failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, auth token missing." });
  }
};

module.exports = { protect };
