"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { Layers } from "lucide-react";
import { ValueType, RowData } from "./ExcelCoercionLab.types";
import { SelectWrapper } from "./SelectWrapper";

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

  const values: ValueType[] = ["TRUE", "FALSE", '"1"', '"12"', "1", "12", "99", "0"];
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
      <div
        className={cn(
          /* layout */
          "flex flex-col",
          /* border */
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div
          className={cn(
            /* layout */
            "flex items-center gap-1 p-1",
            /* background */
            "bg-zinc-50/80 dark:bg-zinc-900/50"
          )}
        >
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
            <div
              className={cn(
                /* layout */
                "px-2",
                /* typography */
                "text-zinc-400 italic font-serif text-sm",
                /* border */
                "border-r border-zinc-100 dark:border-zinc-700",
                /* misc */
                "select-none"
              )}
            >
              fx
            </div>
            <div
              className={cn(
                /* layout */
                "px-2 py-1 w-full",
                /* typography */
                "text-xs font-mono text-zinc-600 dark:text-zinc-300",
                /* misc */
                "truncate"
              )}
            >
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
        <div
          className={cn(
            /* layout */
            "min-w-[600px]"
          )}
        >
          <div
            className={cn(
              /* layout */
              "grid grid-cols-[40px_1.2fr_1.2fr_1fr_1fr_1fr_1fr]",
              /* background */
              "bg-zinc-100 dark:bg-zinc-900"
            )}
          >
            <div
              className={cn(
                /* border */
                "border-r border-b border-zinc-200 dark:border-zinc-800",
                /* layout */
                "h-6 min-w-[40px]"
              )}
            ></div>
            {["A (Val 1)", "B (Val 2)", "C (+)", "D (-)", "E (==)", "F (>)"].map((col) => (
              <div
                key={col}
                className={cn(
                  /* border */
                  "border-r border-b border-zinc-200 dark:border-zinc-800",
                  /* typography */
                  "text-[9px] font-bold text-zinc-400 text-center uppercase",
                  /* layout */
                  "leading-6"
                )}
              >
                {col}
              </div>
            ))}
          </div>

          {rows.map((row, idx) => {
            return (
              <div
                key={row.id}
                className={cn(
                  /* layout */
                  "grid grid-cols-[40px_1.2fr_1.2fr_1fr_1fr_1fr_1fr]"
                )}
              >
                <div
                  className={cn(
                    /* background */
                    "bg-zinc-100 dark:bg-zinc-900",
                    /* border */
                    "border-r border-b border-zinc-200 dark:border-zinc-800",
                    /* typography */
                    "text-[10px] font-bold text-zinc-400 text-center uppercase",
                    /* layout */
                    "leading-10 min-w-[40px]"
                  )}
                >
                  {row.id}
                </div>

                {/* A: Val 1 */}
                <div
                  onClick={() => setActiveCell({ row: idx, col: "A" })}
                  className={cn(
                    /* layout */
                    "relative"
                  )}
                >
                  <SelectWrapper
                    value={row.valA}
                    onValueChange={(v) => updateRow(idx, "valA", v as ValueType)}
                    isActive={activeCell?.row === idx && activeCell?.col === "A"}
                    options={values}
                  />
                </div>

                {/* B: Val 2 */}
                <div
                  onClick={() => setActiveCell({ row: idx, col: "B" })}
                  className={cn(
                    /* layout */
                    "relative"
                  )}
                >
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
                        activeCell?.row === idx && activeCell?.col === col
                          ? cn(
                              /* effect */
                              "ring-2 ring-blue-500 ring-inset z-10",
                              /* background */
                              "bg-white dark:bg-zinc-900"
                            )
                          : cn(
                              /* interaction */
                              "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                            )
                      )}
                    >
                      <span
                        className={cn(
                          /* typography */
                          "text-[11px] font-mono font-bold w-full text-right",
                          /* color */
                          res === "TRUE"
                            ? "text-emerald-600"
                            : res === "FALSE"
                              ? "text-red-600"
                              : "text-blue-600"
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
      <div
        className={cn(
          /* layout */
          "p-2",
          /* background */
          "bg-zinc-50 dark:bg-zinc-900/30",
          /* border */
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        <p
          className={cn(
            /* typography */
            "text-[9px] text-zinc-400 italic",
            /* layout */
            "px-1"
          )}
        >
          열 C~F는 각 연산자의 결과를 실시간으로 보여줍니다. 같은 값이 연산자에 따라 어떻게 다르게 취급되는지 비교해 보세요.
        </p>
      </div>
    </div>
  );
}
