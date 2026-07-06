import express from "express";
import { createVisitor, listVisitors, updateVisitorStatus } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listVisitors);
router.post("/", protect, createVisitor);
router.patch("/:id/status", protect, adminOnly, updateVisitorStatus);

export default router;
