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
const path = require('path');



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
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authDB", {
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
// Order Schema
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  deliveryAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    address2: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  products: [
    {
        productName: { type: String, required: true },  // Change "name" to "productName"
        image: { type: String, required: true },
        price: { type: Number, required: true },
        weight: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true }  // Change "total" to "totalPrice"
    }
],
  status: { type: String, default: "Paid" },
},{timestamps:true});

const Order = mongoose.model("Order", OrderSchema);

// Billing Address Schema
const billingAddressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  deliveryAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    address2: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
}, { timestamps: true });

const BillingAddress = mongoose.model("BillingAddress", billingAddressSchema);

// Admin Dashboard API URL
const ADMIN_DASHBOARD_API = "http://127.0.0.1:5000/api/sync-order";


// Admin Email Configuration
const adminEmail = process.env.ADMIN_EMAIL; // Set this in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

// Store Order Route
app.post('/api/store-order', async (req, res) => {
  console.log('Received create order request');
  console.log('Request body:', req.body);

  let orderId, username, email, deliveryAddress, paymentId, amount, products;
  
  // Destructure and validate required fields
  try {
      ({
        orderId,
          username,
          email,
          deliveryAddress,
          paymentId,
          amount,
          products,
      } = req.body);
      
      console.log("Extracted Order Data:", { orderId,deliveryAddress, products });
      
      // Validate required fields
      if (!orderId || !paymentId || !amount || !products || !deliveryAddress) {
          console.warn("⚠ Missing required fields in the request body.");
          return res.status(400).json({ message: "Missing required fields." });
      }

      // Store order in the database
      const newOrder = new Order({
          orderId: orderId || "N/A",
          username: username || "Unknown User",
          email: email || "N/A",
          deliveryAddress: {
              firstName: deliveryAddress.firstName || "N/A",
              lastName: deliveryAddress.lastName || "N/A",
              address: deliveryAddress.address || "N/A",
              address2: deliveryAddress.address2 || "N/A",
              city: deliveryAddress.city || "N/A",
              state: deliveryAddress.state || "N/A",
              zip: deliveryAddress.zip || "N/A",
              country: deliveryAddress.country || "N/A",
          },
          paymentId: paymentId || "N/A",
          amount: amount || 0,
          products,
          status: "Paid",
      });

      await newOrder.save();
      const billingAddress = new BillingAddress({
        username,
        email,
        deliveryAddress: {
          firstName: deliveryAddress.firstName || "N/A",
          lastName: deliveryAddress.lastName || "N/A",
          address: deliveryAddress.address || "N/A",  
          address2: deliveryAddress.address2 || "N/A",
          state: deliveryAddress.state || "N/A",   
          zip: deliveryAddress.zip || "N/A",
          country: deliveryAddress.country || "N/A",
      }
    });

    await billingAddress.save();
      console.log("✅ Order stored successfully in DB.");

      // Prepare order data to sync with the admin dashboard
      const orderToSync = {
        orderId: orderId || "N/A",
          username: username || "Unknown User",
          email: email || "N/A",
          deliveryAddress: {
              firstName: deliveryAddress.firstName || "N/A",
              lastName: deliveryAddress.lastName || "N/A",
              address: deliveryAddress.address || "N/A",
              address2: deliveryAddress.address2 || "N/A",
              state: deliveryAddress.state || "N/A",
              zip: deliveryAddress.zip || "N/A",
              country: deliveryAddress.country || "N/A",
          },
          paymentId: paymentId || "N/A",
          amount: amount || 0,
          products,
          status: "Paid",
      };

      // Sync order with the admin dashboard
      try {
          const response = await axios.post(ADMIN_DASHBOARD_API, orderToSync);
          console.log("✅ Order synced successfully with admin dashboard:", response.data);
      } catch (syncError) {
          console.error("❌ Failed to sync order with admin dashboard:", syncError.message);
      }
  } catch (err) {
      console.error("❌ Error extracting request data:", err.message);
      return res.status(500).json({ message: "Internal server error." });
  }

  // Prepare the HTML for the email
  let productsTable = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
  `;

  products.forEach(product => {
      productsTable += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.productName || "N/A"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.weight || "N/A"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity || "N/A"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.price || "N/A"}</td>
        </tr>
      `;
  });

  productsTable += `
      </tbody>
    </table>
  `;

  // Send email to admin
  try {
      console.log("📧 Preparing to send email to admin...");
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: adminEmail, // Admin email from environment variables
          subject: "New Order Received",
          html: `
            <h2>New Order Placed</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Customer:</strong> ${username || "Unknown User"}</p>
            <p><strong>Email:</strong> ${email || "N/A"}</p>
            <p><strong>Delivery Address:</strong></p>
            <p>${deliveryAddress.firstName || "N/A"} ${deliveryAddress.lastName || "N/A"}</p>
            <p>${deliveryAddress.address || "N/A"}</p>
            <p>${deliveryAddress.address2 || "N/A"}</p>
            <p>${deliveryAddress.state || "N/A"}, ${deliveryAddress.zip || "N/A"}, ${deliveryAddress.country || "N/A"}</p>
            <p><strong>Products:</strong></p>
            ${productsTable}
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p>Status: Paid</p>
          `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Admin email sent successfully.");
  } catch (emailError) {
      console.error("❌ Failed to send email to admin:", emailError.message);
  }

  // Send success response to the frontend
  res.json({ message: "Order stored, email sent, admin sync attempted." });
});

app.get('/api/get-billing-address', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ message: "Username required." });

  const billingAddress = await BillingAddress.findOne({ username }).sort({ createdAt: -1 });
  if (!billingAddress) return res.status(404).json({ message: "No previous billing address found." });

  res.json(billingAddress.deliveryAddress);
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
// POST /subscribe route
app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  // Setup Nodemailer transport (configure as per your email service)
  const transporter = nodemailer.createTransport({
      service: 'gmail',  // Or any other service you're using
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@6seasonsorganic.com',
      subject: 'New Newsletter Subscription',
      text: `A new subscriber has signed up: ${email}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error:', error);
          return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Thank you for subscribing!' });
  });
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
// Serve the reset-password.html file directly
app.get('/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
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

