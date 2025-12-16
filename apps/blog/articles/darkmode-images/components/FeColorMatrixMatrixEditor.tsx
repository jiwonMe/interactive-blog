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
        "space-y-3",
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
            "min-w-0",
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
          variant="secondary"
          size="sm"
          onClick={onReset}
          className={cn(
            /* layout */
            "shrink-0",
          )}
        >
          reset
        </Button>
      </div>

      <div
        className={cn(
          /* layout */
          "grid grid-cols-6 gap-2",
        )}
      >
        <div />
        {(["R", "G", "B", "A", "1"] as const).map((label) => (
          <div
            key={label}
            className={cn(
              /* layout */
              "flex items-center justify-center",
              /* typography */
              "font-mono text-[11px] font-semibold",
              /* color */
              "text-zinc-600 dark:text-zinc-400",
            )}
          >
            {label}
          </div>
        ))}

        {(["R′", "G′", "B′", "A′"] as const).map((rowLabel, row) => (
          <React.Fragment key={rowLabel}>
            <div
              className={cn(
                /* layout */
                "flex items-center justify-center",
                /* typography */
                "font-mono text-[11px] font-semibold",
                /* color */
                "text-zinc-600 dark:text-zinc-400",
              )}
            >
              {rowLabel}
            </div>
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
                    "font-mono text-[11px]",
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

