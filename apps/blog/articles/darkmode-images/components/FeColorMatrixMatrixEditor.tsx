"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { idx, type Matrix4x5 } from "./feColorMatrixLabData";

export interface FeColorMatrixMatrixEditorProps {
  matrix: Matrix4x5;
  description: string;
  onReset: () => void;
  onChangeCell: (row: number, col: number, next: number) => void;
}

export function FeColorMatrixMatrixEditor({ matrix, description, onReset, onChangeCell }: FeColorMatrixMatrixEditorProps) {
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
            matrix (4×5)
          </p>
          <p
            className={cn(
              /* typography */
              "mt-1 text-xs leading-relaxed",
              /* color */
              "text-zinc-600 dark:text-zinc-400",
            )}
          >
            {description}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className={cn(
            /* layout */
            "shrink-0",
            /* typography */
            "text-xs",
          )}
        >
          reset
        </Button>
      </div>

      <div
        className={cn(
          /* layout */
          "grid grid-cols-6 gap-1.5",
        )}
      >
        {/* Empty corner */}
        <div />
        
        {/* Column headers */}
        {(["R", "G", "B", "A", "1"] as const).map((label) => (
          <div
            key={label}
            className={cn(
              /* layout */
              "flex items-center justify-center rounded-md px-2 py-1.5",
              /* background */
              "bg-zinc-100 dark:bg-zinc-900",
              /* typography */
              "font-mono text-[11px] font-semibold",
              /* color */
              "text-zinc-700 dark:text-zinc-300",
            )}
          >
            {label}
          </div>
        ))}

        {/* Rows */}
        {(["R′", "G′", "B′", "A′"] as const).map((rowLabel, row) => (
          <React.Fragment key={rowLabel}>
            {/* Row header */}
            <div
              className={cn(
                /* layout */
                "flex items-center justify-center rounded-md px-2 py-1.5",
                /* background */
                "bg-zinc-100 dark:bg-zinc-900",
                /* typography */
                "font-mono text-[11px] font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300",
              )}
            >
              {rowLabel}
            </div>
            {/* Row inputs */}
            {Array.from({ length: 5 }).map((_, col) => {
              const value = matrix[idx(row, col)] ?? 0;
              return (
                <Input
                  key={`${row}-${col}`}
                  value={String(value)}
                  inputMode="decimal"
                  onChange={(e) => onChangeCell(row, col, Number(e.target.value))}
                  className={cn(
                    /* typography */
                    "font-mono text-xs text-center",
                    /* layout */
                    "px-2 py-1.5",
                  )}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}


