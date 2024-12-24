const express = require("express");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const punycode = require('punycode/');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const router = express.Router();
// Signup Route
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
router.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: { $eq: email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password Route

router.post('/forgot-password',forgotPasswordLimiter, async (req, res) => {

  const { email } = req.body;

  try {
      const user = await User.findOne({ email: { $eq: email } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '15m' });
      const resetLink = `http://localhost:3000/reset-password.html?token=${resetToken}`;
      const transporter = nodemailer.createTransport({

          service: 'gmail',

          auth: {

              user: process.env.EMAIL_USER,

              pass: process.env.EMAIL_PASS,
          },
      });
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset',
          html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });
      res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
      res.status(500).json({ message: 'Error sending email', error });

  }
});
// Reset Password Route
router.post('/reset-password',forgotPasswordLimiter, async (req, res) => {
  const { token, newPassword } = req.body;
  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          return res.status(400).json({ message: 'Reset token expired.' });
      }
      res.status(400).json({ message: 'Invalid reset token.' });
  }
});


module.exports = router;
