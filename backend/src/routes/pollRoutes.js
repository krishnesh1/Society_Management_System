import express from "express";
import { createPoll, listPolls, votePoll } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listPolls);
router.post("/", protect, adminOnly, createPoll);
router.post("/:id/vote", protect, votePoll);

export default router;
