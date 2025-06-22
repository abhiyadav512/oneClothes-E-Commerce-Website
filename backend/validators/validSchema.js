const { z } = require("zod");
const { category } = require("../database/prisma");

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dob: z.coerce.date().optional(),
  location: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .optional(),
  price: z.coerce
    .number()
    .positive("Price must be a positive number")
    .optional(),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock cannot be negative")
    .optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  sizes: z
    .array(z.string())
    .nonempty("At least one size is required")
    .optional(),
});

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.string().optional(),
});

const cartSchema = z.object({
  productId: z.string().uuid("Invalid product ID").optional(),
  quantity: z.number().min(1, "Add at least one quantity").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  userSchema,
  cartSchema,
};
