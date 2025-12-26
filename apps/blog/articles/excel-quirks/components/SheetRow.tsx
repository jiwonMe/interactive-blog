"use client";

import React from "react";
import { PencilLine } from "lucide-react";
import { cn } from "../../../lib/utils";
import { CellData } from "./SumVsPlusLab.types";

interface SheetRowProps {
  cell: CellData;
  index: number;
  activeCell: string | null;
  editingId: string | null;
  setActiveCell: (id: string | null) => void;
  setEditingId: (id: string | null) => void;
  handleCellChange: (id: string, value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  sumResult: number;
  plusResult: string;
}

export function SheetRow({
  cell,
  index,
  activeCell,
  editingId,
  setActiveCell,
  setEditingId,
  handleCellChange,
  inputRef,
  sumResult,
  plusResult,
}: SheetRowProps) {
  const isA = activeCell === cell.id;
  const isB = activeCell === `B${index + 1}`;

  return (
    <tr key={cell.id}>
      <td
        className={cn(
          /* background */
          "bg-zinc-100 dark:bg-zinc-900",
          /* border */
          "border-r border-b border-zinc-200 dark:border-zinc-800",
          /* typography */
          "text-[10px] font-bold text-zinc-400 text-center select-none",
          /* layout */
          "w-10 min-w-[40px] py-2"
        )}
      >
        {index + 1}
      </td>
      {/* Column A (Editable) */}
      <td
        onClick={() => {
          setActiveCell(cell.id);
          setEditingId(cell.id);
        }}
        className={cn(
          /* layout */
          "group relative h-10 px-3 transition-all cursor-text",
          /* border */
          "border-r border-b border-zinc-100 dark:border-zinc-800",
          /* interaction */
          isA
            ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
          /* background */
          "bg-blue-50/5 dark:bg-blue-900/5"
        )}
      >
        {editingId === cell.id ? (
          <input
            ref={inputRef}
            value={cell.value}
            onChange={(e) => handleCellChange(cell.id, e.target.value)}
            onBlur={() => setEditingId(null)}
            onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
            className={cn(
              /* layout */
              "absolute inset-0 w-full h-full px-3",
              /* background */
              "bg-transparent outline-none",
              /* typography */
              "text-right"
            )}
          />
        ) : (
          <>
            <span
              className={cn(
                /* layout */
                "block w-full text-right",
                /* typography */
                cell.type === "text"
                  ? "text-red-500 font-bold italic bg-red-50/10"
                  : "text-zinc-800 dark:text-zinc-200"
              )}
            >
              {cell.type === "text" && !isNaN(Number(cell.value))
                ? `'${cell.value}`
                : cell.value}
            </span>
            <div
              className={cn(
                /* layout */
                "absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1",
                /* transition */
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <PencilLine
                className={cn(
                  /* layout */
                  "w-2.5 h-2.5",
                  /* color */
                  "text-blue-500"
                )}
              />
              <span
                className={cn(
                  /* typography */
                  "text-[8px] font-bold text-blue-500 uppercase tracking-tighter"
                )}
              >
                Edit
              </span>
            </div>
          </>
        )}
      </td>
      {/* Column B (Calculations) */}
      <td
        onClick={() => {
          setActiveCell(`B${index + 1}`);
          setEditingId(null);
        }}
        className={cn(
          /* layout */
          "relative h-10 px-3 transition-all cursor-pointer",
          /* border */
          "border-b border-zinc-100 dark:border-zinc-800",
          /* background */
          "bg-zinc-50/20 dark:bg-zinc-900/10",
          /* interaction */
          isB
            ? "ring-2 ring-blue-500 ring-inset z-10"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
        )}
      >
        {index === 0 && (
          <div
            className={cn(
              /* layout */
              "flex justify-between items-center w-full h-full"
            )}
          >
            <span
              className={cn(
                /* typography */
                "text-[8px] font-bold text-emerald-500/60 uppercase select-none"
              )}
            >
              SUM
            </span>
            <span
              className={cn(
                /* typography */
                "text-right font-bold text-emerald-600"
              )}
            >
              {sumResult}
            </span>
          </div>
        )}
        {index === 1 && (
          <div
            className={cn(
              /* layout */
              "flex justify-between items-center w-full h-full"
            )}
          >
            <span
              className={cn(
                /* typography */
                "text-[8px] font-bold text-blue-500/60 uppercase select-none"
              )}
            >
              PLUS
            </span>
            <span
              className={cn(
                /* typography */
                "text-right font-bold",
                /* color */
                plusResult === "#VALUE!" ? "text-red-500" : "text-blue-600"
              )}
            >
              {plusResult}
            </span>
          </div>
        )}
        {index > 1 && (
          <span
            className={cn(
              /* layout */
              "block w-full text-right",
              /* typography */
              "text-zinc-200 dark:text-zinc-800"
            )}
          >
            --
          </span>
        )}
      </td>
    </tr>
  );
}

