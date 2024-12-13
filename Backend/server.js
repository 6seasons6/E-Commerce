const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const port = 5000;

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/authDB", {
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

const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.json()); // For parsing JSON
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

app.use(express.json()); // For parsing JSON

// CORS setup for development and production
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000", // Local development (adjust port as needed)
      "https://euphonious-maamoul-f82320.netlify.app", // Production
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Google OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, // Your Google OAuth Client ID
  process.env.CLIENT_SECRET, // Your Google OAuth Client Secret
  "https://euphonious-maamoul-f82320.netlify.app/auth/google/callback" // Redirect URI
);

// Route to initiate the Google OAuth login
app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile"],
  });
  res.redirect(url);
});

// Route to handle the OAuth callback
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code); // Exchange code for tokens
    oauth2Client.setCredentials(tokens);
    res.send("Login Successful!"); // Handle success (e.g., redirect or return a token)
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    // Enable CORS for all origins

// Routes
app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    // Save to MongoDB
    try {
        const newUser = new User({ username, email, password });
        await newUser.save(); // Save the user in the database
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists." });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Signin successful!", user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

