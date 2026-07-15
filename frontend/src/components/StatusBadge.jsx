import React from "react";

const styles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "In Progress": "bg-violet-50 text-violet-700 ring-violet-600/20",
  Resolved: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Approved: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  "Checked In": "bg-sky-50 text-sky-700 ring-sky-600/20",
  "Checked Out": "bg-slate-100 text-slate-600 ring-slate-500/20",
  Paid: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Unpaid: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Overdue: "bg-red-50 text-red-700 ring-red-600/20"
};

export default function StatusBadge({ children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[children] || "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
      {children}
    </span>
  );
}
