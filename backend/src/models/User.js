import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["resident", "admin"], default: "resident" },
    flatNumber: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    emergencyContact: { type: String, trim: true },
    isApproved: { type: Boolean, default: true },
    adminRequest: {
      status: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
      reason: { type: String, trim: true },
      requestedAt: Date,
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
