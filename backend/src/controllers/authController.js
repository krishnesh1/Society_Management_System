import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
