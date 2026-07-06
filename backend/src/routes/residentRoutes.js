import express from "express";
import { listResidents } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, listResidents);

export default router;
