import React from "react";
import { Building2, Loader2 } from "lucide-react";

export function Panel({ title, subtitle, action, children, className = "", loading = false }) {
  return (
    <section className={`overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card ${className}`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{loading ? <PanelSkeleton /> : children}</div>
    </section>
  );
}

export function IconButton({ icon: Icon, label, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-brand-700 text-white hover:bg-brand-800",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-accent-coral text-white hover:bg-rose-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };
  const sizes = {
    sm: "h-8 px-2.5 text-xs gap-1.5",
    md: "h-9 px-3.5 text-sm gap-2",
    icon: "h-9 w-9"
  };

  return (
    <button
      type="button"
      className={`inline-flex max-w-full items-center justify-center rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${label ? sizes[size] : sizes.icon} ${className}`}
      {...props}
    >
      <Icon size={size === "sm" ? 14 : 16} />
      {label && <span className="truncate">{label}</span>}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/10"
      {...props}
    />
  );
}

export function Select(props) {
  return (
    <select
      className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/10"
      {...props}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      className="min-h-[88px] w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/10"
      {...props}
    />
  );
}

export function Empty({ text, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
      {Icon && <Icon className="mb-3 text-slate-300" size={30} strokeWidth={1.5} />}
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-surface">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
        <Building2 size={20} />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="animate-spin text-brand-600" size={16} />
        Opening portal…
      </div>
    </div>
  );
}

export function FormSection({ children, title }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
      {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>}
      {children}
    </div>
  );
}
