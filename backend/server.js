const express = require("express");
const cors = require("cors");
const prisma = require("./database/prisma.js");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes=require("./routes/cartRoutes.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const { initCategories } = require("./utils/initializeCategories.js");

const app = express();

initCategories(); // auto script for add category

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("API is running ..");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
