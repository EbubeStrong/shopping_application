
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// Use an environment variable for your JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Check JWT configuration
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body || {};

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required.",
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email: email.trim().toLowerCase(),
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
      token,
    });
  } catch (e) {
    console.error("Error in registerUser:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to register user. Please try again later.",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const checkUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role || "user",
        email: checkUser.email,
        userName: checkUser.userName,
      },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.error("Error in loginUser:", e);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in.",
    });
  }
};

// Logout
const logoutUser = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing or invalid.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message:
        e.name === "TokenExpiredError"
          ? "Your session has expired. Please log in again."
          : "Invalid authentication token.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};