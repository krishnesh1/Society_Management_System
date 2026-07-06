import express from "express";
import { createComplaint, listComplaints, updateComplaintStatus } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listComplaints);
router.post("/", protect, createComplaint);
router.patch("/:id/status", protect, adminOnly, updateComplaintStatus);

export default router;
