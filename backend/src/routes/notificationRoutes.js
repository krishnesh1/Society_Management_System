import express from "express";
import { createNotification, listNotifications } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listNotifications);
router.post("/", protect, adminOnly, createNotification);

export default router;
