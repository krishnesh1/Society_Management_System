import React from "react";

export default function MetricCard({ metric, onClick }) {
  const Icon = metric.icon;
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group min-w-0 rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-card transition sm:p-5 ${
        onClick ? "hover:border-brand-200 hover:shadow-elevated" : ""
      } ${metric.accent || ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">{metric.label}</p>
          <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums tracking-tight text-ink">
            {metric.value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${metric.tone}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      {metric.change && (
        <p className="mt-4 truncate border-t border-slate-100 pt-3 text-xs text-slate-500">{metric.change}</p>
      )}
    </Wrapper>
  );
}
