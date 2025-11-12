const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const createAuthToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ Register User
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, organization } = req.body;

  // Validate input
  if (!name || !email || !password || !organization) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check existing record
  const exists = await User.findOne({ email, organization });
  if (exists) {
    res.status(400);
    throw new Error("A user with this email already exists in the organization");
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: securePassword,
    organization,
  });

  const token = createAuthToken(newUser);

  res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      organization: newUser.organization,
    },
  });
});

// ✅ Login User
exports.login = asyncHandler(async (req, res) => {
  const { email, password, organization } = req.body;

  // Check if user exists
  const user = await User.findOne({ email, organization });
  if (!user) {
    res.status(400);
    throw new Error("No matching user found for this organization");
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401);
    throw new Error("Incorrect login credentials");
  }

  const token = createAuthToken(user);

  res.json({
    message: "Authenticated successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organization: user.organization,
    },
  });
});

// ✅ Fetch logged-in user details
exports.getUserData = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId).select("-password");
  res.json({ user: currentUser });
});
