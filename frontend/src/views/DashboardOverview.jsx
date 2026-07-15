import React from "react";
import { ArrowRight, Bell, CalendarPlus, MessageSquarePlus, UserPlus, Users, WalletCards } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import MetricCard from "../components/MetricCard.jsx";
import { noticeTypes } from "../data/mockData.js";
import { Empty, Panel } from "../components/ui.jsx";
import { AdminApprovalPanel } from "./AdminApprovalPanel.jsx"; // Imported sibling component

export function DashboardOverview({ user, data, actions, onNavigate, loading }) {
  const isAdmin = user.role === "admin";
  const openComplaints = data.complaints.filter((i) => i.status !== "Resolved").length;
  const activeVisitors = data.visitors.filter((v) => !["Checked Out", "Rejected"].includes(v.status)).length;
  const unpaidBills = data.bills.filter((i) => i.status !== "Paid").length;

  const metricCards = [
    {
      label: isAdmin ? "Residents" : "My complaints",
      value: isAdmin ? (data.stats.totalResidents ?? data.residents.length) : openComplaints,
      change: isAdmin ? `${data.stats.admins ?? 0} committee members` : `${data.complaints.length} total filed`,
      icon: isAdmin ? Users : MessageSquarePlus,
      tone: "bg-brand-50 text-brand-700",
      view: isAdmin ? "Residents" : "Complaints"
    },
    {
      label: "Open complaints",
      value: isAdmin ? (data.stats.pendingComplaints ?? openComplaints) : openComplaints,
      change: isAdmin ? "Across all flats" : "Awaiting resolution",
      icon: MessageSquarePlus,
      tone: "bg-rose-50 text-rose-600",
      view: "Complaints"
    },
    {
      label: "Active visitors",
      value: isAdmin ? (data.stats.visitorsToday ?? activeVisitors) : activeVisitors,
      change: "Currently on premises",
      icon: UserPlus,
      tone: "bg-amber-50 text-amber-700",
      view: "Visitors"
    },
    {
      label: "Unpaid bills",
      value: isAdmin ? (data.stats.unpaidBills ?? unpaidBills) : unpaidBills,
      change: `${data.events.length} upcoming events`,
      icon: WalletCards,
      tone: "bg-violet-50 text-violet-600",
      view: "Bills"
    }
  ];

  const quickLinks = [
    { label: "Complaints", view: "Complaints", count: data.complaints.length, icon: MessageSquarePlus, desc: "Report issues" },
    { label: "Visitors", view: "Visitors", count: data.visitors.length, icon: UserPlus, desc: "Gate passes" },
    { label: "Bills", view: "Bills", count: unpaidBills, icon: WalletCards, desc: "Utility payments" },
    { label: "Events", view: "Events", count: data.events.length, icon: CalendarPlus, desc: "Community calendar" }
  ];

  return (
    <div className="space-y-6">
      <section className="panel-accent overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Flat {user.flatNumber}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Welcome back, {user.name?.split(" ")[0]}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isAdmin ? "Society overview and pending actions" : "Your home dashboard — bills, visitors, and updates"}
            </p>
          </div>
          {!loading && data.notifications.length > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-white"
              onClick={() => onNavigate("Notifications")}
            >
              <Bell size={14} />
              {data.notifications.length} new update{data.notifications.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-[118px] rounded-xl" />
            ))
          : metricCards.map((metric) => (
              <MetricCard key={metric.label} metric={metric} onClick={() => onNavigate(metric.view)} />
            ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.view}
              type="button"
              className="flex min-w-0 items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-card transition hover:border-slate-300"
              onClick={() => onNavigate(link.view)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{link.label}</p>
                  <p className="text-xs text-slate-500">{link.desc} · {link.count}</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300" />
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Recent announcements" loading={loading}>
          {data.announcements.length === 0 ? (
            <Empty text="No announcements yet." icon={Bell} />
          ) : (
            <div className="space-y-2">
              {data.announcements.slice(0, 4).map((notice) => {
                const typeInfo = noticeTypes[notice.type] || noticeTypes.notice;
                return (
                  <div key={notice._id} className="rounded-lg border border-slate-100 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <p className="truncate text-sm font-medium text-ink">{notice.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{notice.message}</p>
                  </div>
                );
              })}
              <button
                type="button"
                className="mt-2 text-xs font-medium text-brand-700 hover:text-brand-800"
                onClick={() => onNavigate("Notices")}
              >
                View all announcements →
              </button>
            </div>
          )}
        </Panel>

        <Panel title="Recent complaints" loading={loading}>
          {data.complaints.length === 0 ? (
            <Empty text="No complaints yet." icon={MessageSquarePlus} />
          ) : (
            <div className="space-y-2">
              {data.complaints.slice(0, 4).map((c) => (
                <div key={c._id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.category}</p>
                  </div>
                  <StatusBadge>{c.status}</StatusBadge>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-xs font-medium text-brand-700 hover:text-brand-800"
                onClick={() => onNavigate("Complaints")}
              >
                View all complaints →
              </button>
            </div>
          )}
        </Panel>
      </div>

      {!isAdmin && (
        <AdminApprovalPanel
          user={user}
          requests={data.adminRequests}
          onRequestAdmin={actions.requestAdmin}
          onReview={actions.reviewAdmin}
          loading={loading}
        />
      )}
      {isAdmin && data.adminRequests.length > 0 && (
        <AdminApprovalPanel
          user={user}
          requests={data.adminRequests}
          onRequestAdmin={actions.requestAdmin}
          onReview={actions.reviewAdmin}
          loading={loading}
        />
      )}
    </div>
  );
}