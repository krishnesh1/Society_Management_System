import express from "express";
import { listResidents,removeResident } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, listResidents);
router.delete('/:id',protect,adminOnly, removeResident);

export default router;
