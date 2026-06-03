const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { escapeRegex, sanitizeSuggestionFilters } = require("../utils/validation");

const router = express.Router();

router.get("/suggestions", authMiddleware, async (req, res) => {
  try {
    const { page, limit, religion, state, city, education, profession, minAge, maxAge } =
      sanitizeSuggestionFilters(req.query);

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const excludedUserIds = [
      currentUser._id,
      ...(currentUser.interestedIn || []),
      ...(currentUser.matches || [])
    ];

    const query = {
      _id: { $nin: excludedUserIds },
      isProfileComplete: true
    };

    if (currentUser.gender === "male") query.gender = "female";
    if (currentUser.gender === "female") query.gender = "male";
    if (religion) query.religion = new RegExp(escapeRegex(religion), "i");
    if (state) query.state = new RegExp(escapeRegex(state), "i");
    if (city) query.city = new RegExp(escapeRegex(city), "i");
    if (education) query.education = new RegExp(escapeRegex(education), "i");
    if (profession) query.profession = new RegExp(escapeRegex(profession), "i");

    if (minAge || maxAge) {
      const today = new Date();
      const dobFilter = {};
      if (maxAge) {
        dobFilter.$gte = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
      }
      if (minAge) {
        dobFilter.$lte = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
      }
      query.dateOfBirth = dobFilter;
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      User.countDocuments(query)
    ]);

    return res.json({
      users,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageLimit) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch suggestions." });
  }
});

router.post("/interest/:id", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    if (targetUserId === req.userId) {
      return res.status(400).json({ message: "You cannot send interest to yourself." });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.userId),
      User.findById(targetUserId)
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.matches.some((id) => id.toString() === targetUser._id.toString())) {
      return res.json({
        message: "You are already matched with this user.",
        matched: true
      });
    }

    if (currentUser.interestedIn.some((id) => id.toString() === targetUser._id.toString())) {
      return res.json({
        message: "Interest already sent.",
        matched: false
      });
    }

    if (!currentUser.interestedIn.some((id) => id.toString() === targetUser._id.toString())) {
      currentUser.interestedIn.push(targetUser._id);
    }

    if (!targetUser.interestedBy.some((id) => id.toString() === currentUser._id.toString())) {
      targetUser.interestedBy.push(currentUser._id);
    }

    let matched = false;

    if (targetUser.interestedIn.some((id) => id.toString() === currentUser._id.toString())) {
      matched = true;

      if (!currentUser.matches.some((id) => id.toString() === targetUser._id.toString())) {
        currentUser.matches.push(targetUser._id);
      }

      if (!targetUser.matches.some((id) => id.toString() === currentUser._id.toString())) {
        targetUser.matches.push(currentUser._id);
      }
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.json({
      message: matched ? "It's a match! You can now chat." : "Interest sent successfully.",
      matched
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send interest." });
  }
});

router.get("/interests-received", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("interestedBy", "-password")
      .select("interestedBy");

    return res.json({ users: user?.interestedBy || [] });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch received interests." });
  }
});

router.get("/interests-sent", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("interestedIn", "-password")
      .select("interestedIn");

    return res.json({ users: user?.interestedIn || [] });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch sent interests." });
  }
});

router.get("/my-matches", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("matches", "-password")
      .select("matches");

    return res.json({ users: user?.matches || [] });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch matches." });
  }
});

module.exports = router;
