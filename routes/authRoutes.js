const express = require("express");
const router = express.Router();
const { signup, login, getUserData } = require("../controllers/authControllers");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/auth", protect, getUserData);

module.exports = router;
