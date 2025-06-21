const express = require("express");
const upload = require("../middleware/multer");
const {
  addProduct,
  getAllProducts,
  updateProduct,
  delProduct,
  getCategoryProduct,
  uploadedImage,
  getProductById,
  searchProducts,
} = require("../controllers/productController");
const { verifytoken } = require("../middleware/varifyToken");
const { requireRole } = require("../middleware/requireRole");
const { validate } = require("../middleware/validate");
const { productSchema } = require("../validators/validSchema");

const router = express.Router();

router.get("/", getAllProducts);

router.post(
  "/",
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  validate(productSchema),
  addProduct
);

router.get("/search", searchProducts);
router.post(
  "/upload-image",
  upload.single("image"),
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  uploadedImage
);

router.put(
  "/:id",
  upload.single("image"),
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  validate(productSchema),
  updateProduct
);

router.delete(
  "/:id",
  verifytoken,
  requireRole(["ADMIN", "SUPER_ADMIN"]),
  delProduct
);

router.get("/category/:category", getCategoryProduct);
router.get("/:ProdId", getProductById);

module.exports = router;
