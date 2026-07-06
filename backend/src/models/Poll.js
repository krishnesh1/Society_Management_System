import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: [
      {
        label: { type: String, required: true, trim: true },
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
      }
    ],
    closesAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
