const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const axios = require('axios');

// Import Routes
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/checkout");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500", // Local development
      "http://127.0.0.1:5000", // Local development
      "https://euphonious-maamoul-f82320.netlify.app", // Production
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
//orders
// Order Schema
const OrderSchema = new mongoose.Schema({
  username:  String,  

  paymentId: String,
  amount: Number,
  productName: String,
  quantity: String,
  totalPrice: String,
  status: { type: String, default: "Paid" },
});

const Order = mongoose.model("Order", OrderSchema);

// Admin Dashboard API URL
const ADMIN_DASHBOARD_API = "http://127.0.0.1:5001/api/sync-order";


// Store Order Route
app.post('/api/store-order', async (req, res) => {
  try {
      console.log('Received create order request');
      console.log('Request body:', req.body);

      // Extract order data from request
      const { username,paymentId, amount, productName, quantity, totalPrice } = req.body;

      // Validate required fields
      if (!paymentId || !amount || !productName || !quantity || !totalPrice) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      // Store order in e-commerce database
      const newOrder = new Order({
        username,
          paymentId,
          amount,
          productName,
          quantity,
          totalPrice,
          status: "Paid",
      });

      await newOrder.save();

      // ✅ Explicitly structure the order data before syncing
      const orderToSync = {
        username,
          paymentId,
          amount,
          productName,
          quantity,
          totalPrice,
          status: "Paid",
      };

      // Send order data to the admin dashboard
      const response = await axios.post(ADMIN_DASHBOARD_API, orderToSync);
      console.log('Sync Response:', response.data);

      res.json({ message: 'Order stored and synced successfully!', order: newOrder });
  } catch (err) {
      console.error('Error syncing order with admin dashboard:', err.message);
      res.status(500).json({ error: 'Failed to sync with admin dashboard', details: err.message });
  }
});

// Rate Limiter for sensitive routes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});

// ==================== Authentication Routes ====================
// Signup Route
app.post("/api/auth/signup", forgotPasswordLimiter, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email: { $eq: email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Signin Route
app.post("/api/auth/signin", forgotPasswordLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }
  
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Signin successful!",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Forgot Password Route
app.post("/api/auth/forgot-password", forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;
 
  try {
    const user = await User.findOne({ email: { $eq: email } });
    if (!user) return res.status(404).json({ message: "User not found." });
 
    const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "15m" });
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
 
    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email.", error });
  }
});
 
// Reset Password Route
app.post("/api/auth/reset-password", forgotPasswordLimiter, async (req, res) => {
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
 
// Google OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
"https://euphonious-maamoul-f82320.netlify.app/auth/google/callback"
);
 
app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
scope: ["https://www.googleapis.com/auth/userinfo.profile"],
  });
  res.redirect(url);
});
 
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
 
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("Login Successful!");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// Additional Routes
app.use("/api/auth", authRoutes);
app.use("/api", paymentRoutes);

// Handle undefined routes (404 error)


// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
