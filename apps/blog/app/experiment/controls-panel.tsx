"use client";

import { cn } from "../../lib/utils";
import type { ControlType } from "./registry";

type ControlsPanelProps = {
  controls: Record<string, ControlType>;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export function ControlsPanel({
  controls,
  values,
  onChange,
  isOpen,
  onToggle,
}: ControlsPanelProps) {
  const hasControls = Object.keys(controls).length > 0;

  if (!hasControls) {
    return null;
  }

  // 닫혀있을 때: 토글 버튼만 표시
  if (!isOpen) {
    return (
      <aside
        className={cn(
          /* Layout */
          "hidden lg:flex",
          "w-10 shrink-0",
          "items-start justify-center",
          /* Spacing */
          "pt-4"
        )}
      >
        <button
          onClick={onToggle}
          className={cn(
            /* Layout */
            "flex items-center justify-center",
            /* Size */
            "w-8 h-8",
            /* Background */
            "bg-zinc-100 dark:bg-zinc-800",
            "border border-zinc-200 dark:border-zinc-700",
            "rounded-lg",
            /* Hover */
            "hover:bg-zinc-200 dark:hover:bg-zinc-700",
            /* Transition */
            "transition-colors"
          )}
          title="컨트롤 열기"
        >
          <ControlsIcon />
        </button>
      </aside>
    );
  }

  // 열려있을 때: 전체 패널 표시
  return (
    <aside
      className={cn(
        /* Layout */
        "hidden lg:flex lg:flex-col",
        "w-[280px] shrink-0",
        /* Border & Background */
        "rounded-2xl",
        "border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-950",
        /* Height */
        "self-start sticky top-24",
        "max-h-[calc(100vh-120px)]",
        "overflow-hidden"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          /* Layout */
          "p-3 flex items-center justify-between",
          "border-b border-zinc-200 dark:border-zinc-800",
          /* Background */
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        <span
          className={cn(
            /* Typography */
            "text-xs font-bold uppercase tracking-wider",
            /* Color */
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          Controls
        </span>
        <button
          onClick={onToggle}
          className={cn(
            /* Layout */
            "p-1.5 rounded-md",
            /* Hover */
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            /* Color */
            "text-zinc-500 dark:text-zinc-400",
            /* Transition */
            "transition-colors"
          )}
          title="컨트롤 닫기"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Controls List */}
      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {Object.entries(controls).map(([key, control]) => (
          <ControlItem
            key={key}
            controlKey={key}
            control={control}
            value={values[key]}
            onChange={onChange}
          />
        ))}
      </div>
    </aside>
  );
}

function ControlsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-500 dark:text-zinc-400"
    >
      <path d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3 6h1.5M3 12h1.5M3 18h1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

type ControlItemProps = {
  controlKey: string;
  control: ControlType;
  value: any;
  onChange: (key: string, value: any) => void;
};

function ControlItem({ controlKey, control, value, onChange }: ControlItemProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={controlKey}
          className={cn(
            /* Typography */
            "text-xs font-semibold",
            /* Color */
            "text-zinc-600 dark:text-zinc-300"
          )}
        >
          {control.label}
        </label>
        {control.type === "number" && (
          <span
            className={cn(
              /* Typography */
              "text-[10px] font-mono px-1 rounded",
              /* Color */
              "text-zinc-400 bg-zinc-100",
              "dark:text-zinc-500 dark:bg-zinc-800"
            )}
          >
            {value}
          </span>
        )}
      </div>

      {/* Text Input */}
      {control.type === "text" && (
        <textarea
          id={controlKey}
          value={value}
          onChange={(e) => onChange(controlKey, e.target.value)}
          rows={controlKey === "code" ? 10 : 1}
          className={cn(
            /* Layout */
            "w-full px-2 py-1.5 border rounded text-xs font-mono",
            /* Focus */
            "focus:outline-none focus:ring-1 focus:ring-blue-500",
            /* Background */
            "bg-white border-zinc-200",
            "dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
            /* Resize */
            controlKey === "code" && "resize-y",
            /* Transition */
            "transition-all"
          )}
          placeholder={controlKey === "code" ? "코드를 입력하세요..." : ""}
        />
      )}

      {/* Number Slider */}
      {control.type === "number" && (
        <input
          type="range"
          id={controlKey}
          min={control.min}
          max={control.max}
          step={control.step}
          value={value}
          onChange={(e) => onChange(controlKey, Number(e.target.value))}
          className={cn(
            /* Layout */
            "w-full h-1.5 rounded-lg block mt-2",
            /* Appearance */
            "appearance-none cursor-pointer accent-blue-600",
            /* Background */
            "bg-zinc-200 dark:bg-zinc-700"
          )}
        />
      )}

      {/* Boolean Toggle */}
      {control.type === "boolean" && (
        <div className="flex items-center">
          <button
            onClick={() => onChange(controlKey, !value)}
            className={cn(
              /* Layout */
              "relative inline-flex h-5 w-9 items-center rounded-full",
              /* Focus */
              "focus:outline-none focus:ring-1 focus:ring-offset-1",
              "focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-zinc-800",
              /* Background */
              value ? "bg-blue-600 dark:bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700",
              /* Transition */
              "transition-colors"
            )}
          >
            <span
              className={cn(
                /* Layout */
                "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm",
                /* Transform */
                value ? "translate-x-4" : "translate-x-1",
                /* Transition */
                "transform transition-transform duration-200 ease-in-out"
              )}
            />
          </button>
        </div>
      )}

      {/* Select Dropdown */}
      {control.type === "select" && (
        <select
          id={controlKey}
          value={value}
          onChange={(e) => onChange(controlKey, e.target.value)}
          className={cn(
            /* Layout */
            "w-full px-2 py-1.5 border rounded text-xs",
            /* Focus */
            "focus:outline-none focus:ring-1 focus:ring-blue-500",
            /* Background */
            "bg-white border-zinc-200",
            "dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
            /* Transition */
            "transition-all"
          )}
        >
          {control.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
