const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

const User =
require("../models/User");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser(name, email, hashedPassword, role);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create user",
      error: process.env.NODE_ENV === "production" ? undefined : err.message
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({
      id: user.id,
      role: user.role
    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      success: true,
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to log in",
      error: process.env.NODE_ENV === "production" ? undefined : err.message
    });
  }
};

module.exports={
 register,
 login
};