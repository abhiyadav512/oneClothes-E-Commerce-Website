const express = require("express");
const { verifytoken } = require("../middleware/varifyToken");
const {
  getUserProfile,
  getProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/profileController");
const { requireRole } = require("../middleware/requireRole");
const { validate } = require("../middleware/validate");
const { userSchema } = require("../validators/validSchema");
const router = express.Router();

// Get own profile
router.get("/me", verifytoken, getProfile);

// (Super user and Admin only)
router.get(
  "/",
  verifytoken,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  getUserProfile
);

// Update user (Only Super Admin can change user roles)
router.patch(
  "/:id",
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  validate(userSchema),
  updateUserProfile
);

// Delete user (Super Admin only)
router.delete("/:id", verifytoken, requireRole(["SUPER_ADMIN"]), deleteUser);

module.exports = router;
