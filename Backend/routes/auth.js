const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

// Rate Limiter for Forgot Password
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Signin successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password
router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email." });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;
