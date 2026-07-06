import User from "../models/User.js";
import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";
import Event from "../models/Event.js";
import Visitor from "../models/Visitor.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requestAdminAccess = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  req.user.adminRequest = {
    status: "pending",
    reason,
    requestedAt: new Date()
  };
  await req.user.save();
  res.json({ message: "Admin access request submitted", adminRequest: req.user.adminRequest });
});

export const getAdminRequests = asyncHandler(async (req, res) => {
  const users = await User.find({ "adminRequest.status": "pending" }).select("-password");
  res.json(users);
});

export const reviewAdminRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be approved or rejected" });
  }

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.adminRequest.status = status;
  user.adminRequest.reviewedAt = new Date();
  user.adminRequest.reviewedBy = req.user._id;
  if (status === "approved") user.role = "admin";

  await user.save();
  res.json({ message: `Admin request ${status}`, user });
});

export const dashboardStats = asyncHandler(async (req, res) => {
  const [totalResidents, admins, pendingAdminRequests, pendingComplaints, visitorsToday, unpaidBills, upcomingEvents] = await Promise.all([
    User.countDocuments({ role: "resident" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ "adminRequest.status": "pending" }),
    Complaint.countDocuments({ status: { $ne: "Resolved" } }),
    Visitor.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    Bill.countDocuments({ status: { $ne: "Paid" } }),
    Event.countDocuments({ eventAt: { $gte: new Date() } })
  ]);

  res.json({ totalResidents, admins, pendingAdminRequests, pendingComplaints, visitorsToday, unpaidBills, upcomingEvents });
});
