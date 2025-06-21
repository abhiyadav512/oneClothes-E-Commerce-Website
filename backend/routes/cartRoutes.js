const express = require("express");
const {
  getCartItem,
  delCartItem,
  updateCartItem,
  addToCart,
} = require("../controllers/cartController");
const { verifytoken } = require("../middleware/varifyToken");
const { validate } = require("../middleware/validate");
const { cartSchema } = require("../validators/validSchema");
const routes = express.Router();

routes.get("/", verifytoken, getCartItem);
routes.delete("/:itemId", verifytoken, delCartItem);
routes.patch("/:itemId", verifytoken, validate(cartSchema), updateCartItem);
routes.post("/", verifytoken, validate(cartSchema), addToCart);

module.exports = routes;
