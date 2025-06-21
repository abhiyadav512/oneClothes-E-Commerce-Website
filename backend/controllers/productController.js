const prisma = require("../database/prisma");
const sendResponse = require("../utils/response");
const cloudinary = require("../utils/cloudinary");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    // console.log(products);
    sendResponse(res, 201, true, "All product listed", products);
  } catch (error) {
    next(error);
  }
};

const uploadedImage = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "Image is required" });
  try {
    const uploadedImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    res.status(200).json({ imageUrl: uploadedImage.secure_url });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  const { name, description, price, stock, category, sizes, imageUrl } =
    req.body;

  // console.log(req.body);
  // console.log("Type of sizes:", typeof sizes);

  if (!imageUrl)
    return res.status(400).json({ message: "Image URL is required" });

  try {
    const foundCategory = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!foundCategory) {
      return res.status(400).json({ message: "Invalid category name" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        sizes,
        category: {
          connect: { id: foundCategory.id },
        },
      },
    });

    // console.log(product);
    sendResponse(res, 201, true, "Product added", product);
  } catch (error) {
    next(error);
    // console.log(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, sizes, category, imageUrl } =
      req.body;

    const foundCategory = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!foundCategory) {
      return res.status(400).json({ message: "Invalid category name" });
    }
    let updatedFields = {
      name,
      description,
      imageUrl,
      sizes,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: {
        connect: { id: foundCategory.id },
      },
    };

    const product = await prisma.product.update({
      where: { id },
      data: updatedFields,
    });

    // console.log(product);
    sendResponse(res, 201, true, "Product updated", product);
  } catch (error) {
    next(error);
  }
};

const delProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    sendResponse(res, 201, true, "Product deleted");
  } catch (error) {
    next(error);
  }
};

const getCategoryProduct = async (req, res, next) => {
  try {
    const { category } = req.params;
    // console.log("category",category);
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: category,
        },
      },
      include: {
        category: true,
      },
    });
    sendResponse(res, 201, true, "Category product list", products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const { ProdId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: ProdId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    sendResponse(res, 200, true, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const keywords = query.trim().split(" ");

    const products = await prisma.product.findMany({
      where: {
        AND: keywords.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      include: {
        category: true,
      },
    });

    sendResponse(res, 200, true, "Search results", products);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  delProduct,
  getCategoryProduct,
  uploadedImage,
  getProductById,
  searchProducts,
};
