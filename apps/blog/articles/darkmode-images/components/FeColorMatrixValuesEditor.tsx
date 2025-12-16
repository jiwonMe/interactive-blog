"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

export interface FeColorMatrixValuesEditorProps {
  rawText: string;
  onRawTextChange: (next: string) => void;
  onCopy: () => void;
  copyState: "idle" | "copied";
}

export function FeColorMatrixValuesEditor({
  rawText,
  onRawTextChange,
  onCopy,
  copyState,
}: FeColorMatrixValuesEditorProps) {
  return (
    <div
      className={cn(
        /* layout */
        "rounded-xl p-4",
        "space-y-3",
        /* background */
        "bg-white dark:bg-zinc-950",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
      )}
    >
      <p
        className={cn(
          /* typography */
          "text-xs font-semibold",
          /* color */
          "text-zinc-800 dark:text-zinc-200",
        )}
      >
        values (copy/paste)
      </p>

      <Textarea
        value={rawText}
        onChange={(e) => onRawTextChange(e.target.value)}
        rows={4}
        className={cn(
          /* typography */
          "font-mono text-[11px] leading-relaxed",
        )}
      />

      <div
        className={cn(
          /* layout */
          "flex flex-wrap items-center justify-between gap-2",
        )}
      >
        <p
          className={cn(
            /* typography */
            "text-[11px] leading-relaxed",
            /* color */
            "text-zinc-500 dark:text-zinc-400",
          )}
        >
          입력하면 자동 적용됨
        </p>

        <Button variant="outline" size="sm" onClick={onCopy}>
          {copyState === "copied" ? "copied" : "copy"}
        </Button>
      </div>
    </div>
  );
}

