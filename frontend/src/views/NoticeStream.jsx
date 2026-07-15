import React, { useState } from "react";
import { Bell, Send } from "lucide-react";
import { noticeTypes } from "../data/mockData.js";
import { Empty, FormSection, IconButton, Input, Panel, Select, Textarea } from "../components/ui.jsx";

export function NoticeStream({ user, items, onCreate, loading }) {
  const [form, setForm] = useState({ title: "", message: "", type: "notice", meetingAt: "", purpose: "" });
  const isAdmin = user.role === "admin";

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("announcement", { ...form, meetingAt: form.meetingAt || undefined });
    if (ok !== false) setForm({ title: "", message: "", type: "notice", meetingAt: "", purpose: "" });
  }

  return (
    <Panel title="Announcements" subtitle="Society notices and updates" loading={loading} action={isAdmin && <IconButton icon={Send} label="Publish" type="submit" form="notice-form" />}>
      {isAdmin && (
        <form id="notice-form" className="mb-5" onSubmit={submit}>
          <FormSection>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="notice">Notice</option>
                <option value="emergency">Emergency</option>
                <option value="maintenance">Maintenance</option>
                <option value="meeting">Meeting</option>
              </Select>
            </div>
            <Textarea required placeholder="Message" className="mt-3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input type="datetime-local" value={form.meetingAt} onChange={(e) => setForm({ ...form, meetingAt: e.target.value })} />
              <Input placeholder="Purpose (optional)" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            </div>
          </FormSection>
        </form>
      )}

      <div className="space-y-3">
        {items.length === 0 && <Empty text="No announcements yet." icon={Bell} />}
        {items.map((notice) => {
          const typeInfo = noticeTypes[notice.type] || noticeTypes.notice;
          return (
            <article key={notice._id} className="rounded-lg border border-slate-100 p-4 transition hover:border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                <span className="text-xs text-slate-400">
                  {notice.meetingAt ? new Date(notice.meetingAt).toLocaleString() : new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-semibold text-ink">{notice.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{notice.message}</p>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}