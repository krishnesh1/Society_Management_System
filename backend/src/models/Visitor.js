import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    flatNumber: { type: String, required: true, trim: true },
    purpose: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Checked In", "Checked Out"], default: "Pending" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    entryAt: Date,
    exitAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);
