import express from "express";
import { createBill, listBills, markBillPaid } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listBills);
router.post("/", protect, adminOnly, createBill);
router.patch("/:id/pay", protect, markBillPaid);

export default router;
