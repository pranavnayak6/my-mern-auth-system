const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getUserData,
} = require("../controllers/authControllers");

const authGuard = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", signup);       // changed endpoint name
router.post("/login", login);
router.get("/profile", authGuard, getUserData);   // changed endpoint name

module.exports = router;
