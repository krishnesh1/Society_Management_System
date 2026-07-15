import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createOtp, sendMail } from "../utils/mailer.js";

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

function sendAuth(res, statusCode, user) {
  res
    .status(statusCode)
    .cookie("token", createToken(user), cookieOptions())
    .json({ user: userPayload(user) });
}

function userPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    flatNumber: user.flatNumber,
    phone: user.phone,
    adminRequest: user.adminRequest
  };
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, flatNumber, phone, emergencyContact } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, flatNumber, phone, emergencyContact });
  await sendMail({
    to: user.email,
    subject: "Welcome to Shekhar Heights",
    text: `Hi ${user.name}, your Shekhar Heights resident account has been created successfully.`
  });
  sendAuth(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  sendAuth(res, 200, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: userPayload(req.user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions()).json({ message: "Logged out" });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = await User.findOne({ email }).select("+resetOtpHash");

  if (user) {
    const otp = createOtp();
    user.resetOtpHash = await bcrypt.hash(otp, 12);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpVerifiedAt = undefined;
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Your Shekhar Heights password reset OTP",
      text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
    });
  }

  res.json({ message: "If that email is registered, an OTP has been sent." });
});

export const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();
  const user = await User.findOne({ email }).select("+resetOtpHash");

  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const matches = await bcrypt.compare(otp, user.resetOtpHash);
  if (!matches) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.resetOtpVerifiedAt = new Date();
  await user.save();
  res.json({ message: "OTP verified" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await User.findOne({ email }).select("+password +resetOtpHash");

  if (!user || !user.resetOtpVerifiedAt || Date.now() - user.resetOtpVerifiedAt.getTime() > 10 * 60 * 1000) {
    return res.status(400).json({ message: "Verify OTP before changing password" });
  }

  user.password = password;
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetOtpVerifiedAt = undefined;
  await user.save();

  await sendMail({
    to: user.email,
    subject: "Shekhar Heights password changed",
    text: "Your Shekhar Heights account password was changed successfully."
  });

  res.json({ message: "Password changed successfully" });
});
