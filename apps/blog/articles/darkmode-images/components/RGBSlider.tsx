"use client";

import React from "react";
import { cn } from "../../../lib/utils";

export interface RGBSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: "r" | "g" | "b";
  className?: string;
}

export function RGBSlider({ label, value, onChange, color, className }: RGBSliderProps) {
  const colorClasses = {
    r: "accent-red-600 dark:accent-red-500",
    g: "accent-green-600 dark:accent-green-500",
    b: "accent-blue-600 dark:accent-blue-500",
  };

  const bgGradient = {
    r: "from-red-500 to-red-900",
    g: "from-green-500 to-green-900",
    b: "from-blue-500 to-blue-900",
  };

  return (
    <div
      className={cn(
        /* layout */
        "space-y-2",
        className
      )}
    >
      <div
        className={cn(
          /* layout */
          "flex items-center justify-between"
        )}
      >
        <label
          className={cn(
            /* typography */
            "text-sm font-medium",
            /* color */
            "text-zinc-700 dark:text-zinc-300"
          )}
        >
          {label}
        </label>
        <span
          className={cn(
            /* typography */
            "text-sm font-mono",
            /* color */
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {value}
        </span>
      </div>
      <div
        className={cn(
          /* layout */
          "relative"
        )}
      >
        <input
          type="range"
          min={0}
          max={255}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            /* layout */
            "w-full h-2 rounded-lg",
            /* appearance */
            "appearance-none cursor-pointer",
            /* color */
            colorClasses[color],
            /* background */
            "bg-zinc-200 dark:bg-zinc-700"
          )}
          style={{
            background: `linear-gradient(to right, rgb(${color === "r" ? value : 0}, ${color === "g" ? value : 0}, ${color === "b" ? value : 0}) 0%, rgb(${color === "r" ? 255 : 0}, ${color === "g" ? 255 : 0}, ${color === "b" ? 255 : 0}) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
