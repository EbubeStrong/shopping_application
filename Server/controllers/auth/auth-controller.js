const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Hash password and create new user
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    
        // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: "user" }, 
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Send token in HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: true }).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
      token
    });

  } catch (e) {
    console.error("Error in registerUser:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};



// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User not found! Please sign up first.",
      });
    }

    // Compare password with the hashed password
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Send token as HTTP-only cookie
    // res.cookie("token", token, { httpOnly: true, secure: false }).json({
    //   success: true,
    //   message: "Logged in successfully",
    //   user: {
    //     email: checkUser.email,
    //     role: checkUser.role,
    //     id: checkUser._id,
    //     userName: checkUser.userName,
    //   },
    // });

    res.status(200).json({
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

    // console.log("Response User:", {
    //   email: checkUser.email,
    //   role: checkUser.role,
    //   id: checkUser._id,
    //   userName: checkUser.userName, //  Debugging log
    // });


  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while logging in.",
    });
  }
};


// logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
}

// auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({
      success: false,
      message: "Unauthorised User!",
    });
  }
};


module.exports = {registerUser, loginUser, logoutUser, authMiddleware}

