import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { complaintCategories } from "../data/mockData.js";
import {
  Empty,
  Field, // Ensure this is imported
  FormSection,
  IconButton,
  Input,
  Panel,
  Select,
  Textarea,
} from "../components/ui.jsx";

export function ComplaintTable({ user, items, onCreate, onStatus, loading }) {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    category: "Water issue", 
    isAnonymous: false 
  });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("complaint", form);
    if (ok !== false) setForm({ title: "", description: "", category: "Water issue", isAnonymous: false });
  }

  return (
    <Panel 
      title="Complaints" 
      subtitle="Submit and track maintenance issues" 
      loading={loading} 
      action={<IconButton icon={MessageSquarePlus} label="Submit" type="submit" form="complaint-form" />}
    >
      <form id="complaint-form" className="mb-5" onSubmit={submit}>
        <FormSection>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required placeholder="Issue title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {complaintCategories.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </div>
          
          {/* BEAUTIFIED TEXTAREA */}
          <div className="mt-3">
            <Field label="Description">
              <div className="relative mt-1.5">
                <Textarea 
                  required 
                  placeholder="Describe the issue in detail..." 
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-ink shadow-sm transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20" 
                  rows={4}
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                />
                <div className="absolute bottom-3 right-3 pointer-events-none text-slate-300">
                  <MessageSquarePlus size={16} />
                </div>
              </div>
            </Field>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
              checked={form.isAnonymous} 
              onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} 
            />
            Submit anonymously
          </label>
        </FormSection>
      </form>

      {items.length === 0 ? (
        <Empty text="No complaints found." icon={MessageSquarePlus} />
      ) : (
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="pb-3 pl-1 font-medium">Issue</th>
                <th className="pb-3 font-medium">Flat</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
                {user.role === "admin" && <th className="pb-3 font-medium">Update</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((complaint) => (
                <tr key={complaint._id} className="group">
                  <td className="py-3.5 pl-1 pr-4 font-medium text-ink">{complaint.title}</td>
                  <td className="py-3.5 text-slate-500">{complaint.flatNumber || complaint.createdBy?.flatNumber || "—"}</td>
                  <td className="py-3.5 pr-4 text-slate-500">{complaint.category}</td>
                  <td className="py-3.5"><StatusBadge>{complaint.status}</StatusBadge></td>
                  {user.role === "admin" && (
                    <td className="py-3.5">
                      <Select className="h-8 text-xs" value={complaint.status} onChange={(e) => onStatus(complaint._id, e.target.value)}>
                        <option>Pending</option><option>In Progress</option><option>Resolved</option>
                      </Select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}