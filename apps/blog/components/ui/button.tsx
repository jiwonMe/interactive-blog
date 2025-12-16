"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        /* base */
        "inline-flex items-center justify-center",
        "rounded-lg font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        /* focus */
        "focus:outline-none focus:ring-2 focus:ring-zinc-400/40 dark:focus:ring-zinc-500/40",
        /* size */
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-9 px-3.5 text-sm",
        /* variant */
        variant === "default" && "bg-zinc-900 text-zinc-50 hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900",
        variant === "secondary" && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
        variant === "outline" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

