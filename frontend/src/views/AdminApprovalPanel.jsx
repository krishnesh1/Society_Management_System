import React, { useState } from "react";
import { AlertTriangle, Send, UserCheck } from "lucide-react";
import { Empty, IconButton, Panel, Textarea } from "../components/ui.jsx";

export function AdminApprovalPanel({ user, requests, onRequestAdmin, onReview, loading }) {
  const [reason, setReason] = useState("");

  if (user.role !== "admin") {
    return (
      <Panel title="Request Admin Access" subtitle="Apply for administrative privileges" loading={loading}>
        <form className="space-y-3" onSubmit={async (event) => {
          event.preventDefault();
          const ok = await onRequestAdmin(reason);
          if (ok !== false) setReason("");
        }}>
          <Textarea required placeholder="Explain why you need admin access…" value={reason} onChange={(e) => setReason(e.target.value)} />
          <IconButton icon={Send} label="Submit Request" />
        </form>
      </Panel>
    );
  }

  return (
    <Panel title="Admin Requests" subtitle="Pending role upgrade requests" loading={loading}>
      <div className="space-y-3">
        {requests.length === 0 && <Empty text="No pending admin requests." icon={UserCheck} />}
        {requests.map((request) => (
          <div key={request._id} className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-500" size={18} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{request.name} · {request.flatNumber}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{request.adminRequest?.reason}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 pl-7">
              <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700" onClick={() => onReview(request._id, "approved")}>Approve</button>
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={() => onReview(request._id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}