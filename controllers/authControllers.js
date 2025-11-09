const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// ✅ Signup
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, organization } = req.body;

  if (!name || !email || !password || !organization) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existing = await User.findOne({ email, organization });
  if (existing) {
    res.status(400);
    throw new Error("User already exists in this organization");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed, organization });
  const token = generateToken(user);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organization: user.organization,
    },
  });
});

// ✅ Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password, organization } = req.body;

  const user = await User.findOne({ email, organization });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or organization");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organization: user.organization,
    },
  });
});

// ✅ Protected /auth route
exports.getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});
