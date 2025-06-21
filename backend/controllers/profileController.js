const prisma = require("../database/prisma");
const sendResponse = require("../utils/response");

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        CartItem: true,
        orders: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    sendResponse(res, 201, true, "Your profile", user);
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    // console.log(users);
    if (!users) return res.status(404).json({ message: "User not found" });
    sendResponse(res, 201, true, "User profile display", users);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    // console.log(targetUserId);
    const { name, email, role } = req.body;

    // console.log(name, role, email);
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Only SUPER_ADMINs can update roles
    if (req.user.role === "SUPER_ADMIN" && role) {
      updateData.role = role;
    }

    // console.log("Requesting user role:", req.user.role);
    // console.log("Request body:", req.body);
    // console.log("Final updateData object:", updateData);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Single response
    sendResponse(
      res,
      200,
      true,
      "User profile updated successfully",
      updatedUser
    );
  } catch (err) {
    // console.error(err);
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, deleteUser, updateUserProfile, getUserProfile };
