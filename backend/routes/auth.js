const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: `"UniPrep OTP" <${process.env.GMAIL_EMAIL}>`,
    to: toEmail,
    subject: "Your UniPrep OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };
  return transporter.sendMail(mailOptions);
}

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  if (user) {
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already registered." });
    }
    user.name = name;
    user.password = password;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    user = new User({ name, email, password, otp, otpExpires, isVerified: false, admin: false });
    await user.save();
  }

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email." });
  } catch (e) {
    res.status(500).json({ message: "Failed to send OTP. Try again." });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found." });
  if (user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: "Email verified." });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found." });
  if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first." });
  if (user.password !== password) return res.status(400).json({ message: "Invalid credentials." });

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, admin: user.admin },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful.",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.admin ? "admin" : "user" }
  });
});

module.exports = router;
