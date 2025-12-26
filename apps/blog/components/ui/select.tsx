"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        /* layout */
        "inline-flex items-center justify-between gap-2",
        "h-9 w-full rounded-lg px-3",
        /* background */
        "bg-white dark:bg-zinc-950",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
        /* typography */
        "text-sm font-medium",
        /* color */
        "text-zinc-900 dark:text-zinc-100",
        /* focus */
        "focus:outline-none focus:ring-2 focus:ring-zinc-400/40 dark:focus:ring-zinc-500/40",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = "popper", ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={6}
        className={cn(
          /* layout */
          "z-50 min-w-[12rem] overflow-hidden rounded-xl p-1",
          /* background */
          "bg-white dark:bg-zinc-950",
          /* border */
          "border border-zinc-200 dark:border-zinc-800",
          /* shadow */
          "shadow-lg",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        /* layout */
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2",
        /* typography */
        "text-sm",
        /* color */
        "text-zinc-900 dark:text-zinc-100",
        /* interaction */
        "focus:bg-zinc-100 focus:outline-none dark:focus:bg-zinc-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});





