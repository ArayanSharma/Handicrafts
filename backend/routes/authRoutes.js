// routes/authRoutes.js

const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/auth.Controller");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", protect, getProfile);

module.exports = router;