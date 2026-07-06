import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Water issue", "Electricity issue", "Security issue", "Noise complaint", "Cleaning issue", "Other"],
      required: true
    },
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
    isPrivate: { type: Boolean, default: true },
    isAnonymous: { type: Boolean, default: false },
    flatNumber: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
