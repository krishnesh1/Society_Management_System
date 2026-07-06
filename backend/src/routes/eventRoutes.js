import express from "express";
import { createEvent, joinEvent, listEvents } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listEvents);
router.post("/", protect, adminOnly, createEvent);
router.post("/:id/join", protect, joinEvent);

export default router;
