const prisma = require("../database/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const sendEmail = require("../utils/sendEmial");

const registerUser = async (req, res, next) => {
  const { email, password, name, dob, location, number } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpriesAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Case 1: Email exists AND verified
    if (existingUser && existingUser.isVerified) {
      const err = new Error("This email is already registered and verified.");
      err.status = 409;
      return next(err);
    }

    // Case 2: Email exists but NOT verified — resend OTP
    if (existingUser && !existingUser.isVerified) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          password: await bcrypt.hash(password, 10),
          dob,
          location,
          number,
          otpHash,
          otpExpriesAt,
        },
      });

      await sendEmail({
        to: email,
        subject: "Your new OTP Code",
        html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin-top: 10px; color: #333;">OneClothes</h2>
          </div>
      
          <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
      
          <p style="font-size: 16px; color: #333;">
            Your One-Time Password (OTP) for verifying your email address is:
          </p>
      
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
      
          <p style="font-size: 14px; color: #555;">
            Please enter this code to complete your registration. This code will expire in <strong>10 minutes</strong>.
          </p>
      
          <p style="font-size: 14px; color: #999; margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
      
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
      
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} OneClothes. All rights reserved.
          </p>
        </div>
      `,
      });

      return sendResponse(
        res,
        200,
        true,
        "Unverified user found. OTP has been resent.",
        { email: updatedUser.email }
      );
    }

    //Case 3: New user — create and send OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dob,
        location,
        number,
        role: "USER",
        isVerified: false,
        otpHash,
        otpExpriesAt,
      },
    });

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin-top: 10px; color: #333;">OneClothes</h2>
        </div>
    
        <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
    
        <p style="font-size: 16px; color: #333;">
          Your One-Time Password (OTP) for verifying your email address is:
        </p>
    
        <div style="font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
    
        <p style="font-size: 14px; color: #555;">
          Please enter this code to complete your registration. This code will expire in <strong>10 minutes</strong>.
        </p>
    
        <p style="font-size: 14px; color: #999; margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
    
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
    
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          &copy; ${new Date().getFullYear()} OneClothes. All rights reserved.
        </p>
      </div>
    `,
    });

    return sendResponse(
      res,
      201,
      true,
      "User registered successfully. OTP sent to email.",
      { email: newUser.email }
    );
  } catch (error) {
    // console.log(error);
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const err = new Error("Invalid email");
      err.status = 401;
      return next(err);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error("Invalid password.., try again.");
      err.status = 401;
      return next(err);
    }
    if (!user.isVerified) {
      const err = new Error("Please verify your email before logging in.");
      err.status = 403;
      return next(err);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return sendResponse(res, 201, true, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // console.log(error);
    return next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otpHash || !user.otpExpriesAt) {
      const err = new Error("Invalid or expired OTP.");
      err.status = 400;
      return next(err);
    }

    if (new Date() > user.otpExpriesAt) {
      const err = new Error("OTP has expired.");
      err.status = 400;
      return next(err);
    }

    const isValid = await bcrypt.compare(otp, user.otpHash);
    if (!isValid) {
      const err = new Error("Invalid OTP.");
      err.status = 400;
      return next(err);
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otpHash: null,
        otpExpriesAt: null,
      },
    });

    return sendResponse(res, 200, true, "Email verified successfully.");
  } catch (error) {
    return next(error);
  }
};

module.exports = { loginUser, registerUser, verifyOtp };
