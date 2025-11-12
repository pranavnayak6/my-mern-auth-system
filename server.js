const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRouter = require("./routes/authRoutes");

// API route prefix
app.use("/api", authRouter);

// Connect to MongoDB
const startDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startDatabase();

// Root endpoint
app.get("/", (_req, res) => {
  res.send("Backend server active!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server is live on port ${port}`);
});
