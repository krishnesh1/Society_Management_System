import React, { useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { Empty, FormSection, IconButton, Input, Panel } from "../components/ui.jsx";

export function VisitorTable({ user, items, onCreate, onStatus, loading }) {
  const [form, setForm] = useState({ name: "", phone: "", flatNumber: user.flatNumber || "", purpose: "" });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("visitor", form);
    if (ok !== false) setForm({ name: "", phone: "", flatNumber: user.flatNumber || "", purpose: "" });
  }

  return (
    <Panel title="Visitor Management" subtitle="Register and track gate entries" loading={loading} action={<IconButton icon={UserPlus} label="Register" type="submit" form="visitor-form" variant="secondary" />}>
      <form id="visitor-form" className="mb-5" onSubmit={submit}>
        <FormSection>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required placeholder="Visitor name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, phone: value });
              }}
            />
            <Input required placeholder="Flat number" value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} />
            <Input required placeholder="Purpose of visit" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
        </FormSection>
      </form>

      <div className="space-y-2">
        {items.length === 0 && <Empty text="No visitors registered yet." icon={UserPlus} />}
        {items.map((visitor) => (
          <div key={visitor._id} className="flex flex-col gap-3 rounded-lg border border-slate-100 px-4 py-3 transition hover:border-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{visitor.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{visitor.flatNumber} · {visitor.purpose} · {visitor.phone}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
              <StatusBadge>{visitor.status}</StatusBadge>
              {user.role === "admin" && visitor.status !== "Rejected" && visitor.status !== "Checked Out" && (
                <>
                  {visitor.status === "Pending" && (
                    <>
                      <IconButton icon={Check} variant="primary" size="sm" onClick={() => onStatus(visitor._id, "Approved")} aria-label="Approve" />
                      <IconButton icon={X} variant="danger" size="sm" onClick={() => onStatus(visitor._id, "Rejected")} aria-label="Reject" />
                    </>
                  )}
                  {visitor.status === "Approved" && (
                    <button className="rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-brand-700" onClick={() => onStatus(visitor._id, "Checked In")}>Check In</button>
                  )}
                  {visitor.status === "Checked In" && (
                    <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800" onClick={() => onStatus(visitor._id, "Checked Out")}>Check Out</button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
