import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Loader2, LogOut, Menu, RefreshCw, Search, X } from "lucide-react";
import { viewTitles } from "../data/mockData.js";

function SearchResults({ results, onSelect, onClose }) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-slate-500">
        No results found
      </div>
    );
  }

  return (
    <ul className="max-h-72 overflow-y-auto py-1">
      {results.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
            onClick={() => {
              onSelect(item.view);
              onClose();
            }}
          >
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
              {item.type}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{item.title}</p>
              {item.subtitle && <p className="truncate text-xs text-slate-500">{item.subtitle}</p>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Topbar({
  user,
  active,
  data,
  onNavigate,
  onOpenSidebar,
  onRefresh,
  onLogout,
  refreshing = false,
  saving = false
}) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items = [];

    data.residents.forEach((r) => {
      if (r.name?.toLowerCase().includes(q) || r.flatNumber?.toLowerCase().includes(q)) {
        items.push({ id: `r-${r._id}`, type: "Resident", title: r.name, subtitle: r.flatNumber, view: "Residents" });
      }
    });

    data.complaints.forEach((c) => {
      if (c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)) {
        items.push({ id: `c-${c._id}`, type: "Complaint", title: c.title, subtitle: c.category, view: "Complaints" });
      }
    });

    data.visitors.forEach((v) => {
      if (v.name?.toLowerCase().includes(q) || v.flatNumber?.toLowerCase().includes(q)) {
        items.push({ id: `v-${v._id}`, type: "Visitor", title: v.name, subtitle: `${v.flatNumber} · ${v.purpose}`, view: "Visitors" });
      }
    });

    data.bills.forEach((b) => {
      if (b.flatNumber?.toLowerCase().includes(q) || b.month?.toLowerCase().includes(q)) {
        items.push({ id: `b-${b._id}`, type: "Bill", title: `${b.flatNumber} — ${b.month}`, subtitle: `Rs. ${b.amount}`, view: "Bills" });
      }
    });

    data.announcements.forEach((a) => {
      if (a.title?.toLowerCase().includes(q)) {
        items.push({ id: `a-${a._id}`, type: "Notice", title: a.title, subtitle: a.type, view: "Notices" });
      }
    });

    data.events.forEach((e) => {
      if (e.title?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q)) {
        items.push({ id: `e-${e._id}`, type: "Event", title: e.title, subtitle: e.venue, view: "Events" });
      }
    });

    return items.slice(0, 8);
  }, [query, data]);

  useEffect(() => {
    function handleClick(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recentNotifications = data.notifications.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = user?.role === "admin" ? "Admin" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{today}</p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-ink">
              {viewTitles[active] || "Dashboard"}
            </h1>
            <p className="truncate text-xs text-slate-500">
              {greeting}, {user?.name?.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          {saving && (
            <span className="hidden items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-800 sm:inline-flex">
              <Loader2 className="animate-spin" size={12} />
              Saving
            </span>
          )}

          <div className="relative flex-1 lg:flex-none" ref={searchRef}>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 transition focus-within:border-brand-600/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-600/10">
              <Search size={15} className="shrink-0 text-slate-400" />
              <input
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-52 xl:w-60"
                placeholder="Search anything…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {searchOpen && query.trim() && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated sm:w-80">
                <SearchResults results={results} onSelect={onNavigate} onClose={() => setSearchOpen(false)} />
              </div>
            )}
          </div>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="Notifications"
            >
              <Bell size={17} />
              {data.notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-coral px-1 text-[10px] font-bold text-white">
                  {Math.min(data.notifications.length, 9)}
                  {data.notifications.length > 9 ? "+" : ""}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated sm:w-80">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">Notifications</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-brand-700 hover:text-brand-800"
                    onClick={() => {
                      onNavigate("Notifications");
                      setNotifOpen(false);
                    }}
                  >
                    View all
                  </button>
                </div>
                {recentNotifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet</p>
                ) : (
                  <ul className="max-h-72 overflow-y-auto">
                    {recentNotifications.map((item) => (
                      <li key={item._id} className="border-b border-slate-50 px-4 py-3 last:border-0">
                        <p className="text-sm font-medium text-ink">{item.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            onClick={onLogout}
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>

          <div className="hidden h-9 items-center rounded-lg border border-brand-100 bg-brand-50 px-3 text-xs font-semibold capitalize text-brand-800 sm:flex">
            {user?.role}
          </div>
        </div>
      </div>
    </header>
  );
}
