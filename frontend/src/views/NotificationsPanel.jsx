import React from "react";
import { Bell } from "lucide-react";
import { Empty, Panel } from "../components/ui.jsx";

export function NotificationsPanel({ items, loading }) {
  return (
    <Panel title="Notifications" subtitle="All society alerts and updates" loading={loading}>
      <div className="space-y-2">
        {items.length === 0 && <Empty text="No notifications yet." icon={Bell} />}
        {items.map((item) => (
          <div key={item._id} className="flex gap-3 rounded-lg border border-slate-100 px-4 py-3.5 transition hover:border-slate-200">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Bell size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{item.message}</p>
              <p className="mt-1 text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}