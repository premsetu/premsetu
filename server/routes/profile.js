const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const { runtimeConfig } = require("../config/runtime");
const { validateProfileUpdate } = require("../utils/validation");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 7
  },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      callback(new Error("Only JPG, PNG, and WEBP images are allowed."));
      return;
    }

    callback(null, true);
  }
});

const bufferToDataUri = (file) => {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
};

const PROFILE_FIELDS = [
  "fullName",
  "phone",
  "gender",
  "dateOfBirth",
  "religion",
  "caste",
  "gotra",
  "motherTongue",
  "city",
  "state",
  "education",
  "profession",
  "annualIncome",
  "height",
  "maritalStatus",
  "bio"
];

const calculateCompletion = (user) => {
  const requiredFields = [
    "fullName",
    "phone",
    "gender",
    "dateOfBirth",
    "religion",
    "motherTongue",
    "city",
    "state",
    "education",
    "profession",
    "height",
    "maritalStatus",
    "bio",
    "profilePhoto"
  ];

  const filledCount = requiredFields.filter((field) => Boolean(user[field])).length;
  return Math.round((filledCount / requiredFields.length) * 100);
};

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user,
      completionPercentage: calculateCompletion(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch profile." });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { errors, data } = validateProfileUpdate(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const updateData = {};

    PROFILE_FIELDS.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    const existingUser = await User.findById(req.userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const mergedUser = {
      ...existingUser.toObject(),
      ...updateData
    };

    updateData.isProfileComplete = calculateCompletion(mergedUser) >= 85;

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true
    }).select("-password");

    return res.json({
      message: "Profile updated successfully.",
      user,
      completionPercentage: calculateCompletion(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Profile update failed." });
  }
});

router.post(
  "/upload-photo",
  authMiddleware,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "photos", maxCount: 6 }
  ]),
  async (req, res) => {
    try {
      const updateData = {};
      const uploadBuffer = (file) =>
        new Promise((resolve, reject) => {
          if (!isCloudinaryConfigured) {
            if (!runtimeConfig.allowLocalUploadFallback) {
              reject(new Error("Cloudinary is not configured for uploads."));
              return;
            }

            resolve(bufferToDataUri(file));
            return;
          }

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "premsetu"
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(result.secure_url);
            }
          );

          uploadStream.end(file.buffer);
        });

      if (req.files.profilePhoto?.[0]) {
        updateData.profilePhoto = await uploadBuffer(req.files.profilePhoto[0]);
      }

      if (req.files.photos?.length) {
        updateData.photos = await Promise.all(req.files.photos.map((file) => uploadBuffer(file)));
      }

      const existingUser = await User.findById(req.userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const mergedUser = {
        ...existingUser.toObject(),
        ...updateData
      };

      updateData.isProfileComplete = calculateCompletion(mergedUser) >= 85;

      const user = await User.findByIdAndUpdate(req.userId, updateData, {
        new: true,
        runValidators: true
      }).select("-password");

      return res.json({
        message: "Photo upload successful.",
        user,
        completionPercentage: calculateCompletion(user)
      });
    } catch (error) {
      return res.status(500).json({ message: "Photo upload failed." });
    }
  }
);

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid profile id." });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Profile not found." });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch profile." });
  }
});

module.exports = router;
