const express = require("express");
const { loginUser, registerUser, verifyEmail, verifyOtp } = require("../controllers/authController");
const { validate } = require("../middleware/validate");
const { loginSchema, registerSchema } = require("../validators/validSchema");

const router = express.Router();

router.post("/singin",validate(loginSchema), loginUser);
router.post("/singup",validate(registerSchema), registerUser);
router.post("/verify-otp", verifyOtp); 

module.exports = router;
