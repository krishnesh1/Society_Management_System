import React from "react";
import { Building2, X } from "lucide-react";
import { navItems } from "../data/mockData.js";

export default function Sidebar({ active, setActive, isOpen, setIsOpen, user }) {
  const items = navItems.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-[2px] transition-opacity lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-zinc-800/80 bg-zinc-950 transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white ring-1 ring-brand-500/30">
              <Building2 size={18} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">Shekhar Heights</p>
              <p className="text-[11px] text-zinc-500">Resident portal</p>
            </div>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-1 no-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;

            return (
              <button
                key={item.label}
                type="button"
                className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition ${
                  selected
                    ? "bg-zinc-900 text-white ring-1 ring-zinc-700"
                    : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200"
                }`}
                onClick={() => {
                  setActive(item.label);
                  setIsOpen(false);
                }}
              >
                <Icon size={17} strokeWidth={selected ? 2.25 : 2} className={selected ? "text-brand-400" : ""} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800/80 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2.5 ring-1 ring-zinc-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">{user?.name}</p>
              <p className="truncate text-[11px] capitalize text-zinc-500">
                {user?.role} · Flat {user?.flatNumber}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
