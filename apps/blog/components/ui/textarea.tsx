"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        /* layout */
        "w-full resize-y",
        /* typography */
        "text-sm leading-relaxed",
        /* shape */
        "rounded-lg p-3",
        /* background */
        "bg-white dark:bg-zinc-950",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
        /* color */
        "text-zinc-900 dark:text-zinc-100",
        /* focus */
        "focus:outline-none focus:ring-2 focus:ring-zinc-400/40 dark:focus:ring-zinc-500/40",
        /* placeholder */
        "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
        className,
      )}
      {...props}
    />
  );
});


