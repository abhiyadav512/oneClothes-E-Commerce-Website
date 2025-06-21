const prisma = require("../database/prisma");

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient role" });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { requireRole };
