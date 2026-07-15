import Announcement from "../models/Announcement.js";
import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import Poll from "../models/Poll.js";
import User from "../models/User.js";
import Visitor from "../models/Visitor.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().populate("createdBy", "name role").sort({ createdAt: -1 });
  res.json(announcements);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: announcement.title,
    message: announcement.message,
    type: announcement.type === "meeting" ? "meeting" : "announcement",
    createdBy: req.user._id
  });
  res.status(201).json(announcement);
});

export const listComplaints = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
  const complaints = await Complaint.find(filter).populate("createdBy", "name flatNumber").sort({ createdAt: -1 });
  res.json(complaints);
});

export const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    createdBy: req.body.isAnonymous ? undefined : req.user._id,
    flatNumber: req.user.flatNumber
  });
  res.status(201).json(complaint);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  complaint.status = req.body.status;
  complaint.assignedTo = req.user._id;
  if (req.body.status === "Resolved") complaint.resolvedAt = new Date();
  await complaint.save();

  res.json(complaint);
});

export const listVisitors = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { flatNumber: req.user.flatNumber };
  const visitors = await Visitor.find(filter).populate("requestedBy approvedBy", "name role").sort({ createdAt: -1 });
  res.json(visitors);
});

export const createVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.create({ ...req.body, requestedBy: req.user._id });
  res.status(201).json(visitor);
});

export const updateVisitorStatus = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });

  visitor.status = req.body.status;
  visitor.approvedBy = req.user._id;
  if (req.body.status === "Checked In") visitor.entryAt = new Date();
  if (req.body.status === "Checked Out") visitor.exitAt = new Date();
  await visitor.save();

  res.json(visitor);
});

export const listBills = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { resident: req.user._id };
  const bills = await Bill.find(filter).populate("resident", "name flatNumber").sort({ dueDate: -1 });
  res.json(bills);
});

export const createBill = asyncHandler(async (req, res) => {
  const amount = Number(req.body.unitsUsed) * Number(req.body.ratePerUnit);
  const bill = await Bill.create({ ...req.body, amount });
  res.status(201).json(bill);
});

export const markBillPaid = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ message: "Bill not found" });

  bill.status = "Paid";
  bill.paidAt = new Date();
  await bill.save();
  res.json(bill);
});

export const listEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("participants", "name flatNumber").sort({ eventAt: 1 });
  res.json(events);
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: `New event: ${event.title}`,
    message: `${event.venue} - ${new Date(event.eventAt).toLocaleString()}`,
    type: "event",
    createdBy: req.user._id
  });
  res.status(201).json(event);
});

export const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (!event.participants.some((id) => id.equals(req.user._id))) {
    event.participants.push(req.user._id);
    await event.save();
  }

  res.json(event);
});

export const listPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 });
  res.json(polls);
});

export const createPoll = asyncHandler(async (req, res) => {
  const poll = await Poll.create({
    question: req.body.question,
    closesAt: req.body.closesAt,
    options: req.body.options.map((label) => ({ label, votes: [] })),
    createdBy: req.user._id
  });
  await Notification.create({
    title: "New poll",
    message: poll.question,
    type: "poll",
    createdBy: req.user._id
  });
  res.status(201).json(poll);
});

export const votePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  poll.options.forEach((option) => {
    option.votes = option.votes.filter((voterId) => !voterId.equals(req.user._id));
  });

  const option = poll.options.id(req.body.optionId);
  if (!option) return res.status(404).json({ message: "Poll option not found" });

  option.votes.push(req.user._id);
  await poll.save();
  res.json(poll);
});

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ recipients: { $size: 0 } }, { recipients: req.user._id }]
  }).sort({ createdAt: -1 });
  res.json(notifications);
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(notification);
});

export const listResidents = asyncHandler(async (req, res) => {
  const residents = await User.find().select("-password").sort({ flatNumber: 1 });
  res.json(residents);
});


export const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findByIdAndDelete(req.params.id);
  if (!poll) return res.status(404).json({ message: "Poll not found" });
  res.json({ message: "Poll deleted successfully" });
});

export const addResidentToPoll = asyncHandler(async (req, res) => {
  const { pollId, userId } = req.body;
  const poll = await Poll.findByIdAndUpdate(
    pollId, 
    { $addToSet: { permittedResidents: userId } }, 
    { new: true }
  );
  res.json(poll);
});

export const  removeResident = asyncHandler(async(req,res)=>{
  try {
    const resident = await User.findByIdAndDelete(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

})

export const deleteBill = asyncHandler(async(req,res)=>{
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    
    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({ message: "Server error while deleting bill" });
  }
})