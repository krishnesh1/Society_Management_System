import express from "express";
import { dashboardStats, getAdminRequests, requestAdminAccess, reviewAdminRequest } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/request", protect, requestAdminAccess);
router.get("/requests", protect, adminOnly, getAdminRequests);
router.patch("/requests/:userId", protect, adminOnly, reviewAdminRequest);
router.get("/stats", protect, adminOnly, dashboardStats);

export default router;
