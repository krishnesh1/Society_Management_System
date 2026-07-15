import express from "express";
import {
  login,
  logout,
  me,
  requestPasswordReset,
  resetPassword,
  signup,
  verifyPasswordResetOtp
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);

export default router;
