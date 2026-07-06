import React from "react";
import { Bell, Search, Shield } from "lucide-react";

export default function Topbar({ user }) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/70 bg-white/75 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="pl-12 lg:pl-0">
        <p className="text-sm font-bold text-forest">Admin Dashboard</p>
        <h1 className="text-2xl font-extrabold tracking-normal text-ink sm:text-3xl">Nirvana Heights</h1>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <label className="hidden h-11 min-w-0 items-center gap-2 rounded-md border border-ink/10 bg-white px-3 text-sm text-ink/55 shadow-sm md:flex">
          <Search size={17} />
          <input className="w-56 bg-transparent outline-none" placeholder="Search flats, residents, visitors" />
        </label>
        <button className="grid h-11 w-11 place-items-center rounded-md border border-ink/10 bg-white shadow-sm" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="flex h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm font-bold text-white">
          <Shield size={17} />
          {user?.role || "User"}
        </div>
      </div>
    </header>
  );
}
