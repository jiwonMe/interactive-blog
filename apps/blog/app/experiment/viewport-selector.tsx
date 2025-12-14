"use client";

import { cn } from "../../lib/utils";

export type ViewportSize = "responsive" | "mobile" | "tablet" | "desktop";

export const VIEWPORT_SIZES: Record<ViewportSize, { label: string; width: number | null; icon: React.ReactNode }> = {
  responsive: {
    label: "Responsive",
    width: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  mobile: {
    label: "Mobile",
    width: 375,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  tablet: {
    label: "Tablet",
    width: 768,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  desktop: {
    label: "Desktop",
    width: 1024,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
};

type ViewportSelectorProps = {
  value: ViewportSize;
  onChange: (value: ViewportSize) => void;
};

export function ViewportSelector({ value, onChange }: ViewportSelectorProps) {
  return (
    <div
      className={cn(
        /* Layout */
        "flex items-center gap-1",
        /* Background */
        "p-1 rounded-lg",
        "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((size) => {
        const { label, icon, width } = VIEWPORT_SIZES[size];
        const isActive = value === size;

        return (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={cn(
              /* Layout */
              "flex items-center gap-1.5 px-2 py-1.5 rounded-md",
              /* Typography */
              "text-xs font-medium",
              /* Transition */
              "transition-colors",
              /* Active state */
              isActive
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
            title={width ? `${label} (${width}px)` : label}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
