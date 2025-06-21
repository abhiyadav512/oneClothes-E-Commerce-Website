const prisma = require("../database/prisma");
const sendResponse = require("../utils/response");

const getCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    sendResponse(res, 201, true, "Cart item listed", cartItems);
  } catch (error) {
    next(error);
  }
};

const delCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    sendResponse(res, 200, true, "Cart item deleted", null);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) }, // first pars into number
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    sendResponse(res, 201, true, "Cart item updated", updated);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity,selectedSize } = req.body;
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Product not available or insufficient stock" });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId, selectedSize },
    });


    let updatedItem;
    if (existingItem) {
      updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: quantity },
        },
      });
    
    } else {
      updatedItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          selectedSize,
        },
      });
    }

    sendResponse(res, 201, true, "Cart item added", updatedItem);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCartItem, delCartItem, updateCartItem, addToCart };
