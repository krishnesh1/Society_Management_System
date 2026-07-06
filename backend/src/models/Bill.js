import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flatNumber: { type: String, required: true },
    month: { type: String, required: true },
    unitsUsed: { type: Number, required: true, min: 0 },
    ratePerUnit: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Unpaid", "Paid", "Overdue"], default: "Unpaid" },
    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
