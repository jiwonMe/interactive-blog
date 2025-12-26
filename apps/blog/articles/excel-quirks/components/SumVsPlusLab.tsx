"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { Calculator } from "lucide-react";
import { CellData } from "./SumVsPlusLab.types";
import { SheetRow } from "./SheetRow";

/**
 * 직접 편집 가능한 셀을 포함한 엑셀 스타일 컴포넌트
 */
export function SumVsPlusLab() {
  const [cells, setCells] = useState<CellData[]>([
    { id: "A1", value: "10", type: "number" },
    { id: "A2", value: '"20"', type: "text" },
    { id: "A3", value: "30", type: "number" },
  ]);
  const [activeCell, setActiveCell] = useState<string | null>("A1");
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleCellChange = (id: string, newValue: string) => {
    setCells((prev) =>
      prev.map((cell) => {
        if (cell.id === id) {
          if (newValue.startsWith("'")) {
            return { ...cell, value: newValue.substring(1), type: "text" };
          }
          const isNum = !isNaN(Number(newValue)) && newValue.trim() !== "";
          return { ...cell, value: newValue, type: isNum ? "number" : "text" };
        }
        return cell;
      })
    );
  };

  const sumResult = cells.reduce((acc, cell) => {
    if (cell.type === "text") return acc;
    const val = Number(cell.value);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const plusResult = (() => {
    let res = 0;
    for (const cell of cells) {
      if (cell.type === "text") return "#VALUE!";
      const val = Number(cell.value);
      if (isNaN(val) || cell.value.trim() === "") return "#VALUE!";
      res += val;
    }
    return res.toString();
  })();

  return (
    <div
      className={cn(
        /* layout */
        "w-full my-6",
        /* shape */
        "rounded-sm overflow-hidden",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
        /* background */
        "bg-white dark:bg-zinc-950 shadow-sm"
      )}
    >
      {/* Interactive Badge */}
      <div
        className={cn(
          /* layout */
          "flex items-center justify-between px-3 py-1",
          /* background */
          "bg-zinc-100 dark:bg-zinc-900",
          /* border */
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div
          className={cn(
            /* layout */
            "flex items-center gap-1.5"
          )}
        >
          <Calculator
            className={cn(
              /* layout */
              "w-3 h-3",
              /* color */
              "text-zinc-400"
            )}
          />
          <span
            className={cn(
              /* typography */
              "text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
            )}
          >
            Interactive Sheet
          </span>
        </div>
        <span
          className={cn(
            /* typography */
            "text-[9px] font-medium text-emerald-600 dark:text-emerald-400",
            /* background */
            "bg-emerald-50 dark:bg-emerald-900/20",
            /* layout */
            "px-1.5 py-0.5",
            /* shape */
            "rounded-full",
            /* border */
            "border border-emerald-100 dark:border-emerald-800/50"
          )}
        >
          실시간 계산 중
        </span>
      </div>

      {/* Formula Bar */}
      <div
        className={cn(
          /* layout */
          "p-1 flex items-center gap-1",
          /* background */
          "bg-zinc-50/80 dark:bg-zinc-900/50",
          /* border */
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div
          className={cn(
            /* layout */
            "px-2 py-0.5 min-w-[40px]",
            /* typography */
            "text-[10px] font-bold text-zinc-400 text-center uppercase select-none",
            /* background */
            "bg-white dark:bg-zinc-800",
            /* border */
            "border border-zinc-200 dark:border-zinc-700",
            /* shape */
            "rounded-sm"
          )}
        >
          {activeCell || " "}
        </div>
        <div
          className={cn(
            /* layout */
            "flex-1 px-2 py-1 min-h-[24px]",
            /* background */
            "bg-white dark:bg-zinc-800",
            /* border */
            "border border-zinc-200 dark:border-zinc-700",
            /* shape */
            "rounded-sm",
            /* typography */
            "text-xs font-mono text-zinc-500 truncate"
          )}
        >
          {editingId
            ? cells.find((c) => c.id === editingId)?.type === "text" &&
              !isNaN(Number(cells.find((c) => c.id === editingId)?.value))
              ? `'${cells.find((c) => c.id === editingId)?.value}`
              : cells.find((c) => c.id === editingId)?.value
            : activeCell === "B1"
              ? "=SUM(A1:A3)"
              : activeCell === "B2"
                ? "=A1+A2+A3"
                : activeCell
                  ? cells.find((c) => c.id === activeCell)?.type === "text" &&
                    !isNaN(Number(cells.find((c) => c.id === activeCell)?.value))
                    ? `'${cells.find((c) => c.id === activeCell)?.value}`
                    : cells.find((c) => c.id === activeCell)?.value
                  : ""}
        </div>
      </div>

      <div
        className={cn(
          /* layout */
          "overflow-x-auto relative"
        )}
      >
        <table
          className={cn(
            /* layout */
            "w-full min-w-[400px]",
            /* typography */
            "text-left border-collapse"
          )}
        >
          <thead
            className={cn(
              /* background */
              "bg-zinc-100 dark:bg-zinc-900",
              /* typography */
              "text-[10px] font-bold text-zinc-400 uppercase select-none"
            )}
          >
            <tr>
              <th
                className={cn(
                  /* layout */
                  "w-10 min-w-[40px]",
                  /* border */
                  "border-r border-b border-zinc-200 dark:border-zinc-800"
                )}
              ></th>
              <th
                className={cn(
                  /* layout */
                  "w-1/2 px-3 py-1",
                  /* border */
                  "border-r border-b border-zinc-200 dark:border-zinc-800",
                  /* typography */
                  "text-center tracking-widest"
                )}
              >
                A (Input)
              </th>
              <th
                className={cn(
                  /* layout */
                  "w-1/2 px-3 py-1",
                  /* border */
                  "border-b border-zinc-200 dark:border-zinc-800",
                  /* typography */
                  "text-[9px] text-center tracking-widest"
                )}
              >
                B (Calculation)
              </th>
            </tr>
          </thead>
          <tbody
            className={cn(
              /* typography */
              "text-xs font-mono"
            )}
          >
            {cells.map((cell, i) => (
              <SheetRow
                key={cell.id}
                cell={cell}
                index={i}
                activeCell={activeCell}
                editingId={editingId}
                setActiveCell={setActiveCell}
                setEditingId={setEditingId}
                handleCellChange={handleCellChange}
                inputRef={inputRef}
                sumResult={sumResult}
                plusResult={plusResult}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Footer */}
      <div
        className={cn(
          /* layout */
          "px-3 py-2",
          /* background */
          "bg-zinc-50 dark:bg-zinc-900/50",
          /* border */
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        <p
          className={cn(
            /* typography */
            "text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug",
            /* layout */
            "flex items-center gap-1.5"
          )}
        >
          <span
            className={cn(
              /* layout */
              "w-1 h-1",
              /* background */
              "bg-blue-500 rounded-full animate-pulse"
            )}
          />
          A2 셀처럼 숫자 앞에 작은따옴표(&apos;)를 붙이면 텍스트로 인식됩니다. SUM은 이 셀을 무시하지만, + 연산자는 셀 참조 시 #VALUE! 에러를 발생시킵니다.
        </p>
      </div>
    </div>
  );
}
