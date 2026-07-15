import express from "express";
import { createPoll, listPolls, votePoll,deletePoll,addResidentToPoll } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listPolls);
router.post("/", protect, adminOnly, createPoll);
router.post("/:id/vote", protect, votePoll);
router.delete("/:id", protect, adminOnly, deletePoll);
router.patch("/:id/add-resident", protect, adminOnly, addResidentToPoll);

export default router;
