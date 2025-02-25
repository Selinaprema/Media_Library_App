const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("⚠️ Error: Missing JWT_SECRET in .env file");
  process.exit(1);
}

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
  console.log("Received Token:", token); // Debugging line to log the token

  if (!token) {
    console.log("No token provided"); // Debugging line
    return res.status(403).json({ message: "Access Denied" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message); // Debugging line
      return res.status(403).json({ message: "Invalid Token" });
    }

    console.log("Decoded Token:", decoded); // Debugging line to check the decoded token
    req.user = decoded; // Store decoded user info
    next();
  });
};

// Route to fetch media from iTunes API
app.get("/api/search", verifyToken, async (req, res) => {
  const { term, media } = req.query;

  if (!term || !media) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const response = await axios.get(`https://itunes.apple.com/search`, {
      params: { term, media, limit: 20 },
    });
    res.json(response.data);
  } catch (error) {
    console.error("iTunes API Error:", error.message);
    res.status(500).json({ message: "Error fetching data from iTunes API" });
  }
});

// Route to generate JWT Token
app.post("/api/token", (req, res) => {
  try {
    // Generate a token for a user
    const token = jwt.sign({ user: "guest" }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token });
  } catch (error) {
    console.error("JWT Token Error:", error.message);
    res.status(500).json({ message: "Error generating token" });
  }
});

// Start Server
app.listen(PORT, () => {});
