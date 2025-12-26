"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SelectWrapperProps {
  value: string;
  onValueChange: (v: string) => void;
  isActive: boolean;
  options: string[];
}

export function SelectWrapper({
  value,
  onValueChange,
  isActive,
  options,
}: SelectWrapperProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          /* layout */
          "w-full h-10 px-2 flex items-center justify-between outline-none",
          /* border */
          "border-r border-b border-zinc-100 dark:border-zinc-800",
          /* typography */
          "text-xs font-mono",
          /* effect */
          "transition-all",
          isActive
            ? cn(
                /* effect */
                "ring-2 ring-blue-500 ring-inset z-10",
                /* background */
                "bg-white dark:bg-zinc-900"
              )
            : cn(
                /* interaction */
                "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
                /* background */
                "bg-blue-50/5"
              )
        )}
      >
        <Select.Value>{value}</Select.Value>
        <Select.Icon>
          <ChevronDown
            className={cn(
              /* layout */
              "w-3 h-3",
              /* color */
              "text-zinc-300"
            )}
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={cn(
            /* layout */
            "overflow-hidden z-50 shadow-xl",
            /* background */
            "bg-white dark:bg-zinc-900",
            /* border */
            "border border-zinc-200 dark:border-zinc-800",
            /* shape */
            "rounded-sm"
          )}
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className={cn(
                  /* layout */
                  "relative flex items-center px-6 py-1.5 outline-none select-none",
                  /* typography */
                  "text-[11px] font-mono text-zinc-600 dark:text-zinc-400",
                  /* shape */
                  "rounded-sm",
                  /* transition */
                  "transition-colors",
                  /* interaction */
                  "cursor-pointer",
                  /* effect */
                  "data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800 data-[highlighted]:text-zinc-900 dark:data-[highlighted]:text-zinc-100"
                )}
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator
                  className={cn(
                    /* layout */
                    "absolute left-1.5 flex items-center justify-center"
                  )}
                >
                  <Check
                    className={cn(
                      /* layout */
                      "w-3 h-3",
                      /* color */
                      "text-blue-500"
                    )}
                  />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

