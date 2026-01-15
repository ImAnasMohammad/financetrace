const express = require("express");
const router = express.Router();

// Controllers
const { join, verifyOtp } = require("../controllers/auth.controller");

// 🔐 Auth Routes
router.post("/join", join);      // Email + Password → OTP
router.post("/verify-otp", verifyOtp);   // OTP + Temp Token → Access Token

module.exports = router;
