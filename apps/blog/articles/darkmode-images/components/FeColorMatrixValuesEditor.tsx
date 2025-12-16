"use client";

import React from "react";
import { Copy, Check } from "lucide-react";
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
        "space-y-4",
        /* background */
        "bg-white dark:bg-zinc-950",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
      )}
    >
      <div
        className={cn(
          /* layout */
          "flex items-start justify-between gap-3",
        )}
      >
        <div
          className={cn(
            /* layout */
            "min-w-0 flex-1",
          )}
        >
          <p
            className={cn(
              /* typography */
              "text-sm font-semibold",
              /* color */
              "text-zinc-900 dark:text-zinc-100",
            )}
          >
            values (copy/paste)
          </p>
          <p
            className={cn(
              /* typography */
              "mt-1 text-xs leading-relaxed",
              /* color */
              "text-zinc-600 dark:text-zinc-400",
            )}
          >
            입력하면 자동 적용됨
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className={cn(
            /* layout */
            "shrink-0",
            /* typography */
            "text-xs",
            /* layout */
            "inline-flex items-center gap-1.5",
          )}
        >
          {copyState === "copied" ? (
            <>
              <Check
                className={cn(
                  /* size */
                  "h-3.5 w-3.5",
                  /* color */
                  "text-green-600 dark:text-green-400",
                )}
              />
              <span>copied</span>
            </>
          ) : (
            <>
              <Copy
                className={cn(
                  /* size */
                  "h-3.5 w-3.5",
                )}
              />
              <span>copy</span>
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={rawText}
        onChange={(e) => onRawTextChange(e.target.value)}
        rows={4}
        className={cn(
          /* typography */
          "font-mono text-xs leading-relaxed",
          /* layout */
          "resize-none",
        )}
        placeholder="예: 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
      />
    </div>
  );
}


