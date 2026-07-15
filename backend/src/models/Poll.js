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
    startsAt: Date,
    closesAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    permittedResidents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
