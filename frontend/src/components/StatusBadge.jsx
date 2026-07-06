import React from "react";

const styles = {
  Pending: "bg-amber/15 text-amber",
  "In Progress": "bg-violet/15 text-violet",
  Resolved: "bg-forest/15 text-forest",
  Approved: "bg-forest/15 text-forest",
  Rejected: "bg-coral/15 text-coral",
  "Checked In": "bg-violet/15 text-violet",
  "Checked Out": "bg-ink/10 text-ink",
  Paid: "bg-forest/15 text-forest",
  Unpaid: "bg-amber/15 text-amber",
  Overdue: "bg-coral/15 text-coral"
};

export default function StatusBadge({ children }) {
  return <span className={`rounded-md px-2 py-1 text-xs font-extrabold ${styles[children] || "bg-ink/10 text-ink"}`}>{children}</span>;
}
