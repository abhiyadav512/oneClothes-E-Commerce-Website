const prisma = require("../database/prisma");
const sendResponse = require("../utils/response");

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, selectedSize } = req.body;

    let orderItems = [];
    let totalPrice = 0;

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const price = product.price || product.originalPrice || 0;
      totalPrice = price * quantity;

      orderItems.push({
        productId,
        quantity,
        price,
      });
    } else {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (!cartItems.length) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty." });
      }

      orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      await prisma.cartItem.deleteMany({ where: { userId } });
    }
    // Razorpay Order
    const rezorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "PENDING",
        razorpayOrderId: rezorpayOrder.id,
        orderItems: {
          create: orderItems,
        },
      },
      include: { orderItems: true },
    });

    res.status(201).json({
      success: true,
      message: "Order created, proceed to payment",
      order,
      rezorpayOrder: {
        id: rezorpayOrder.id,
        amount: rezorpayOrder.amount,
        currency: rezorpayOrder.currency,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;
    
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "PAID",
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrder = async (req, res, next) => {
  try {
    // console.log("log");
    const userId = req.user.id;
    // console.log("user id:",userId);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
      },
    });

    if (!orders.length) {
      return res.status(201).json({
        success: false,
        message: "You don't have any orders. Shop now!",
      });
    }

    sendResponse(res, 201, true, "You order", orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const isAdmin =
      req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN";

    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    sendResponse(res, 201, true, "All user order are", orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const isAdmin = req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN";
  if (!isAdmin) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["PENDING", "PAID", "SHIPPED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    sendResponse(res, 201, true, "Status updated", order);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Cancellation reason required" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to cancel this order" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
      },
    });

    // console.log(updatedOrder);
    return res
      .status(200)
      .json({ success: true, message: "Order cancelled", data: updatedOrder });
  } catch (error) {
    // console.error(error);
    return next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrder,
  getAllOrder,
  updateOrderStatus,
  cancelOrder,
  verifyPayment,
};
