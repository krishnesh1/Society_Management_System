import React from "react";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { navItems } from "../data/mockData.js";

export default function Sidebar({ active, setActive, isOpen, setIsOpen }) {
  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-md border border-ink/10 bg-white shadow-soft lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/70 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-xl transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-forest text-white shadow-crisp">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-lg font-extrabold">Nirvana Heights</p>
            <p className="text-sm text-ink/55">Society command center</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;

            return (
              <button
                key={item.label}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                  selected ? "bg-ink text-white shadow-crisp" : "text-ink/70 hover:bg-forest/10 hover:text-ink"
                }`}
                onClick={() => {
                  setActive(item.label);
                  setIsOpen(false);
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-md border border-forest/20 bg-forest/10 p-4">
          <p className="text-xs font-bold uppercase text-ink/45">Default Admin</p>
          <p className="mt-1 break-words text-sm font-semibold">krishnesh@gmail.com</p>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink/55">
            <LogOut size={14} /> Protected admin routes ready
          </p>
        </div>
      </aside>
    </>
  );
}
