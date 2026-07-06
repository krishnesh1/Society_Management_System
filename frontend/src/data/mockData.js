import {
  Bell,
  Bolt,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Megaphone,
  ShieldCheck,
  Users,
  Vote,
  WalletCards
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", icon: ClipboardList },
  { label: "Residents", icon: Users },
  { label: "Complaints", icon: ShieldCheck },
  { label: "Visitors", icon: CheckCircle2 },
  { label: "Bills", icon: WalletCards },
  { label: "Events", icon: CalendarDays },
  { label: "Polls", icon: Vote },
  { label: "Notices", icon: Megaphone }
];

export const metrics = [
  { label: "Residents", value: "248", change: "+12 this month", icon: Users, tone: "bg-forest text-white" },
  { label: "Pending Complaints", value: "18", change: "6 urgent", icon: ShieldCheck, tone: "bg-coral text-white" },
  { label: "Visitors Today", value: "42", change: "31 approved", icon: CheckCircle2, tone: "bg-amber text-ink" },
  { label: "Unpaid Bills", value: "23", change: "Rs. 84,700 due", icon: Bolt, tone: "bg-violet text-white" }
];

export const notices = [
  { title: "Monthly society meeting", type: "Meeting", time: "21 May, 7:00 PM", body: "Budget review, lift maintenance timeline, and festival planning." },
  { title: "Water tank cleaning", type: "Maintenance", time: "Tomorrow, 10:00 AM", body: "Water supply may be slow for Block A and B until 2:00 PM." },
  { title: "Emergency gate drill", type: "Security", time: "Friday", body: "Security team will test visitor verification and gate response flow." }
];

export const complaints = [
  { title: "Low water pressure", flat: "A-1204", category: "Water issue", status: "In Progress" },
  { title: "Basement lights flicker", flat: "B-0302", category: "Electricity issue", status: "Pending" },
  { title: "Noise after 11 PM", flat: "C-0901", category: "Noise complaint", status: "Resolved" }
];

export const visitors = [
  { name: "Rohit Sharma", flat: "A-703", purpose: "Guest", status: "Approved", time: "10:35 AM" },
  { name: "UrbanClap Service", flat: "B-204", purpose: "AC repair", status: "Pending", time: "11:10 AM" },
  { name: "Courier Partner", flat: "C-1102", purpose: "Parcel", status: "Checked In", time: "12:05 PM" }
];

export const bills = [
  { flat: "A-101", units: 184, amount: "Rs. 1,472", status: "Paid" },
  { flat: "B-908", units: 231, amount: "Rs. 1,848", status: "Unpaid" },
  { flat: "C-407", units: 167, amount: "Rs. 1,336", status: "Overdue" }
];

export const polls = [
  { question: "Choose celebration theme", options: [{ label: "Cultural Night", value: 48 }, { label: "Food Festival", value: 36 }, { label: "Sports Day", value: 16 }] },
  { question: "Preferred meeting day", options: [{ label: "Saturday", value: 58 }, { label: "Sunday", value: 42 }] }
];

export const events = [
  { title: "Monsoon Potluck", date: "25 May", venue: "Clubhouse", joined: 86 },
  { title: "Yoga Morning", date: "29 May", venue: "Garden Deck", joined: 34 },
  { title: "Kids Art Jam", date: "2 Jun", venue: "Community Hall", joined: 51 }
];

export const notifications = [
  { icon: Bell, text: "Visitor approval needed for B-204", tone: "text-amber" },
  { icon: ShieldCheck, text: "Complaint #CMP-102 moved to In Progress", tone: "text-forest" },
  { icon: WalletCards, text: "Electricity bill due reminder sent", tone: "text-coral" }
];
