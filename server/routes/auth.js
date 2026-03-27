const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateLoginInput, validateRegistrationInput } = require("../utils/validation");

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { errors, data } = validateRegistrationInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { fullName, email, password, phone, gender, dateOfBirth } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth
    });

    const token = signToken(user._id);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { errors, data } = validateLoginInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
