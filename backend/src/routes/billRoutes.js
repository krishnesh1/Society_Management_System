import express from "express";
import { createBill, listBills, markBillPaid,deleteBill } from "../controllers/resourceControllers.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listBills);
router.post("/", protect, adminOnly, createBill);
router.patch("/:id/pay", protect, markBillPaid);
router.delete("/:id", protect, adminOnly, deleteBill);

export default router;
