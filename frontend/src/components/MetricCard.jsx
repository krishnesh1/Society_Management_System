import React from "react";

export default function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <div className="rounded-md border border-white/80 bg-white/90 p-5 shadow-crisp backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink/55">{metric.label}</p>
          <p className="mt-2 text-3xl font-extrabold">{metric.value}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md shadow-sm ${metric.tone}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 border-t border-ink/10 pt-4 text-sm font-semibold text-ink/55">{metric.change}</p>
    </div>
  );
}
