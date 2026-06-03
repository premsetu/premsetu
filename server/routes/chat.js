const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

const ensureMatch = async (userId, otherUserId) => {
  const user = await User.findById(userId).select("matches");
  return user?.matches.some((id) => id.toString() === otherUserId);
};

router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.userId, isRead: false });
    return res.json({ count });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch unread count." });
  }
});

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const isMatched = await ensureMatch(req.userId, otherUserId);
    if (!isMatched) {
      return res.status(403).json({ message: "You can only chat with your matches." });
    }

    const [messages, otherUser] = await Promise.all([
      Message.find({
        $or: [
          { sender: req.userId, receiver: otherUserId },
          { sender: otherUserId, receiver: req.userId }
        ]
      })
        .sort({ timestamp: 1 })
        .populate("sender", "fullName profilePhoto")
        .populate("receiver", "fullName profilePhoto"),
      User.findById(otherUserId).select("fullName profilePhoto city state profession")
    ]);

    await Message.updateMany(
      { sender: otherUserId, receiver: req.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ messages, otherUser });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch chat." });
  }
});

router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const messageText = String(message || "").trim();

    if (!receiver || !messageText) {
      return res.status(400).json({ message: "Receiver and message are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid receiver id." });
    }

    if (receiver === req.userId) {
      return res.status(400).json({ message: "You cannot message yourself." });
    }

    if (messageText.length > 1000) {
      return res.status(400).json({ message: "Message must be 1000 characters or less." });
    }

    const isMatched = await ensureMatch(req.userId, receiver);
    if (!isMatched) {
      return res.status(403).json({ message: "You can only message your matches." });
    }

    const createdMessage = await Message.create({
      sender: req.userId,
      receiver,
      message: messageText
    });

    const populatedMessage = await Message.findById(createdMessage._id)
      .populate("sender", "fullName profilePhoto")
      .populate("receiver", "fullName profilePhoto");

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${req.userId}`).to(`user:${receiver}`).emit("chat:new-message", populatedMessage);
    }

    return res.status(201).json({
      message: "Message sent.",
      data: populatedMessage
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message." });
  }
});

module.exports = router;
