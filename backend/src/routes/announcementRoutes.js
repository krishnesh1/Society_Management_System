import express from "express";
import { createAnnouncement, listAnnouncements } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);

export default router;
