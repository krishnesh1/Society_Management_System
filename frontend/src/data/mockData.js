import {
  Bell,
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
  { label: "Residents", icon: Users, adminOnly: true },
  { label: "Complaints", icon: ShieldCheck },
  { label: "Visitors", icon: CheckCircle2 },
  { label: "Bills", icon: WalletCards },
  { label: "Events", icon: CalendarDays },
  { label: "Polls", icon: Vote },
  { label: "Notices", icon: Megaphone },
  { label: "Notifications", icon: Bell }
];

export const viewTitles = {
  Dashboard: "Overview",
  Residents: "Resident Directory",
  Complaints: "Complaints",
  Visitors: "Visitor Management",
  Bills: "Electricity Bills",
  Events: "Events",
  Polls: "Community Polls",
  Notices: "Announcements",
  Notifications: "Notifications"
};

export const noticeTypes = {
  notice: { label: "Notice", color: "bg-sky-100 text-sky-700" },
  emergency: { label: "Emergency", color: "bg-red-100 text-red-700" },
  maintenance: { label: "Maintenance", color: "bg-amber-100 text-amber-700" },
  meeting: { label: "Meeting", color: "bg-violet-100 text-violet-700" }
};

export const complaintCategories = [
  "Water issue",
  "Electricity issue",
  "Security issue",
  "Noise complaint",
  "Cleaning issue",
  "Other"
];
