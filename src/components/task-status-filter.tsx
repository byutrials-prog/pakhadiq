"use client";

import { useState } from "react";

export type TaskStatus = "Semua" | "Berjalan" | "Selesai";

interface FilterOption {
  label: TaskStatus;
  count: number;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "Semua", count: 4 },
  { label: "Berjalan", count: 2 },
  { label: "Selesai", count: 2 },
];

export function TaskStatusFilter() {
  const [active, setActive] = useState<TaskStatus>("Semua");

  return (
    <div
      id="task-status-filter"
      className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1"
    >
      {FILTER_OPTIONS.map(({ label, count }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            id={`filter-${label.toLowerCase()}`}
            onClick={() => setActive(label)}
            className={[
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {label}
            <span
              className={[
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}