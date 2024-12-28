const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
 
// Import Routes
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./checkout");
 
const app = express();
const PORT = process.env.PORT || 5001;
 
// Middleware
app.use(cors({
  origin: [
"http://127.0.0.1:3000", // Local development
"https://euphonious-maamoul-f82320.netlify.app", // Production
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
 
app.use(express.json());
app.use(bodyParser.json());
 
// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api', paymentRoutes); // Payment routes
 
// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/authDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
 
// Google OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, // Your Google OAuth Client ID
  process.env.CLIENT_SECRET, // Your Google OAuth Client Secret
"https://euphonious-maamoul-f82320.netlify.app/auth/google/callback" // Redirect URI
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
    const { tokens } = await oauth2Client.getToken(code); // Exchange code for tokens
    oauth2Client.setCredentials(tokens);
    res.send("Login Successful!");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});
 
// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});