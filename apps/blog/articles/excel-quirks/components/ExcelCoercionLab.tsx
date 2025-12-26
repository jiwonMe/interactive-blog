"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { ChevronDown, Layers, Check } from "lucide-react";
import * as Select from "@radix-ui/react-select";

type ValueType = "TRUE" | "FALSE" | '"1"' | '"12"' | "1" | "12" | "99";

interface RowData {
  id: number;
  valA: ValueType;
  valB: ValueType;
}

/**
 * 엑셀 형 변환 실험실 (Matrix Spreadsheet UI)
 * 여러 연산자(+, -, ==, >)의 결과를 한눈에 비교할 수 있는 매트릭스 도구
 */
export function ExcelCoercionLab() {
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>({ row: 0, col: "A" });
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, valA: "TRUE", valB: "1" },
    { id: 2, valA: "FALSE", valB: "0" },
    { id: 3, valA: '"1"', valB: "1" },
    { id: 4, valA: '"12"', valB: "12" },
    { id: 5, valA: "TRUE", valB: "99" },
  ]);

  const values: ValueType[] = ["TRUE", "FALSE", '"1"', '"12"', "1", "12", "99"];
  const operators = ["+", "-", "==", ">"];
  const opToCol = { "+": "C", "-": "D", "==": "E", ">": "F" };
  const colToOp = { "C": "+", "D": "-", "E": "==", "F": ">" };

  const calculate = (valA: ValueType, valB: ValueType, op: string) => {
    const getVal = (v: ValueType) => {
      if (v === "TRUE") return 1;
      if (v === "FALSE") return 0;
      return Number(v.toString().replace(/"/g, ""));
    };

    if (op === "+" || op === "-") {
      const res = op === "+" ? getVal(valA) + getVal(valB) : getVal(valA) - getVal(valB);
      return res.toString();
    }
    if (op === "==") return valA === valB ? "TRUE" : "FALSE";
    if (op === ">") {
      const getRank = (v: string) => {
        if (v === "TRUE" || v === "FALSE") return 3;
        if (v.includes('"')) return 2;
        return 1;
      };
      const rankA = getRank(valA);
      const rankB = getRank(valB);
      if (rankA !== rankB) return rankA > rankB ? "TRUE" : "FALSE";
      return getVal(valA) > getVal(valB) ? "TRUE" : "FALSE";
    }
    return "#VALUE!";
  };

  const updateRow = (idx: number, field: "valA" | "valB", value: ValueType) => {
    const newRows = [...rows];
    newRows[idx] = { ...newRows[idx], [field]: value };
    setRows(newRows);
  };

  return (
    <div
      className={cn(
        /* layout */
        "w-full my-6 shadow-sm",
        /* border */
        "border border-zinc-200 dark:border-zinc-800",
        /* shape */
        "rounded-sm overflow-hidden",
        /* background */
        "bg-white dark:bg-zinc-950"
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
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Coercion Matrix</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">Full Comparison</span>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1 p-1 bg-zinc-50/80 dark:bg-zinc-900/50">
          <div
            className={cn(
              /* layout */
              "px-2 py-0.5 min-w-[45px]",
              /* background */
              "bg-white dark:bg-zinc-800",
              /* border */
              "border border-zinc-200 dark:border-zinc-700",
              /* typography */
              "text-[10px] font-bold text-zinc-400 text-center uppercase",
              /* shape */
              "rounded-sm"
            )}
          >
            {activeCell ? `${activeCell.col}${activeCell.row + 1}` : " "}
          </div>
          <div
            className={cn(
              /* layout */
              "flex items-center flex-1 overflow-hidden",
              /* background */
              "bg-white dark:bg-zinc-800",
              /* border */
              "border border-zinc-200 dark:border-zinc-700",
              /* shape */
              "rounded-sm"
            )}
          >
            <div className="px-2 text-zinc-400 italic font-serif text-sm border-r border-zinc-100 dark:border-zinc-700 select-none">fx</div>
            <div className="px-2 py-1 text-xs font-mono text-zinc-600 dark:text-zinc-300 w-full truncate">
              {activeCell && ["C", "D", "E", "F"].includes(activeCell.col)
                ? `=${rows[activeCell.row].valA}${colToOp[activeCell.col as keyof typeof colToOp]}${rows[activeCell.row].valB}`
                : activeCell
                  ? rows[activeCell.row][activeCell.col === "A" ? "valA" : "valB"]
                  : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_1fr_1fr_1fr] bg-zinc-100 dark:bg-zinc-900">
            <div className="border-r border-b border-zinc-200 dark:border-zinc-800 h-6 min-w-[40px]"></div>
            {["A (Val 1)", "B (Val 2)", "C (+)", "D (-)", "E (==)", "F (>)"].map((col) => (
              <div key={col} className="border-r border-b border-zinc-200 dark:border-zinc-800 text-[9px] font-bold text-zinc-400 text-center leading-6 uppercase">
                {col}
              </div>
            ))}
          </div>

          {rows.map((row, idx) => {
            return (
              <div key={row.id} className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_1fr_1fr_1fr]">
                <div className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center leading-10 min-w-[40px]">
                  {row.id}
                </div>

                {/* A: Val 1 */}
                <div onClick={() => setActiveCell({ row: idx, col: "A" })} className="relative">
                  <SelectWrapper
                    value={row.valA}
                    onValueChange={(v) => updateRow(idx, "valA", v as ValueType)}
                    isActive={activeCell?.row === idx && activeCell?.col === "A"}
                    options={values}
                  />
                </div>

                {/* B: Val 2 */}
                <div onClick={() => setActiveCell({ row: idx, col: "B" })} className="relative">
                  <SelectWrapper
                    value={row.valB}
                    onValueChange={(v) => updateRow(idx, "valB", v as ValueType)}
                    isActive={activeCell?.row === idx && activeCell?.col === "B"}
                    options={values}
                  />
                </div>

                {/* C, D, E, F: Results */}
                {operators.map((op) => {
                  const res = calculate(row.valA, row.valB, op);
                  const col = opToCol[op as keyof typeof opToCol];
                  return (
                    <div
                      key={op}
                      onClick={() => setActiveCell({ row: idx, col })}
                      className={cn(
                        /* layout */
                        "h-10 flex items-center px-2 transition-all cursor-pointer",
                        /* border */
                        "border-r border-b border-zinc-100 dark:border-zinc-800",
                        /* background */
                        "bg-zinc-50/20 dark:bg-zinc-900/5",
                        activeCell?.row === idx && activeCell?.col === col ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                      )}
                    >
                      <span
                        className={cn(
                          /* typography */
                          "text-[11px] font-mono font-bold w-full text-right",
                          /* color */
                          res === "TRUE" ? "text-emerald-600" : res === "FALSE" ? "text-red-600" : "text-blue-600"
                        )}
                      >
                        {res}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[9px] text-zinc-400 italic px-1">
          열 C~F는 각 연산자의 결과를 실시간으로 보여줍니다. 같은 값이 연산자에 따라 어떻게 다르게 취급되는지 비교해 보세요.
        </p>
      </div>
    </div>
  );
}

function SelectWrapper({ value, onValueChange, isActive, options }: { value: string; onValueChange: (v: string) => void; isActive: boolean; options: string[] }) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          /* layout */
          "w-full h-10 px-2 flex items-center justify-between transition-all outline-none",
          /* border */
          "border-r border-b border-zinc-100 dark:border-zinc-800",
          /* typography */
          "text-xs font-mono",
          isActive ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30 bg-blue-50/5"
        )}
      >
        <Select.Value>{value}</Select.Value>
        <Select.Icon>
          <ChevronDown className="w-3 h-3 text-zinc-300" />
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
                  "relative flex items-center px-6 py-1.5 outline-none cursor-pointer select-none",
                  /* typography */
                  "text-[11px] font-mono text-zinc-600 dark:text-zinc-400",
                  /* shape */
                  "rounded-sm",
                  /* transition */
                  "data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800 data-[highlighted]:text-zinc-900 dark:data-[highlighted]:text-zinc-100"
                )}
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-1.5 flex items-center justify-center">
                  <Check className="w-3 h-3 text-blue-500" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
