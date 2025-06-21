const express = require("express");
const {
  createOrder,
  getMyOrder,
  getAllOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { verifytoken } = require("../middleware/varifyToken");
const { requireRole } = require("../middleware/requireRole");

const routes = express.Router();

routes.post("/", verifytoken, createOrder);
routes.get("/my", verifytoken, getMyOrder);
routes.get(
  "/all-orders",
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  getAllOrder
);
routes.patch(
  "/:id",
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  updateOrderStatus
);

routes.patch("/cancel/:id", verifytoken, cancelOrder);

module.exports = routes;
