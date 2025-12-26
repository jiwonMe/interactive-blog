"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { DataItem, TraceInfo } from "./VlookupDefaultRisk.types";

interface VlookupGridProps {
  unsortedData: DataItem[];
  trace: TraceInfo | null;
  currentStepIndex: number | null;
  activeCell: { row: number; col: "A" | "B" | "D" | "E" } | null;
  setActiveCell: (cell: { row: number; col: "A" | "B" | "D" | "E" } | null) => void;
  lookupValue: number;
}

export function VlookupGrid({
  unsortedData,
  trace,
  currentStepIndex,
  activeCell,
  setActiveCell,
  lookupValue,
}: VlookupGridProps) {
  const resultCellValue = trace ? unsortedData[trace.resultIdx].name : null;

  return (
    <div
      className={cn(
        /* layout */
        "overflow-x-auto"
      )}
    >
      <table
        className={cn(
          /* layout */
          "w-full min-w-[500px]",
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
                "w-24 px-3 py-1",
                /* border */
                "border-r border-b border-zinc-200 dark:border-zinc-800"
              )}
            >
              A (ID)
            </th>
            <th
              className={cn(
                /* layout */
                "w-32 px-3 py-1",
                /* border */
                "border-r border-b border-zinc-200 dark:border-zinc-800"
              )}
            >
              B (Name)
            </th>
            <th
              className={cn(
                /* layout */
                "w-24 px-3 py-1",
                /* border */
                "border-r border-b border-zinc-200 dark:border-zinc-800"
              )}
            >
              D (Lookup)
            </th>
            <th
              className={cn(
                /* layout */
                "w-32 px-3 py-1",
                /* border */
                "border-b border-zinc-200 dark:border-zinc-800"
              )}
            >
              E (Result)
            </th>
          </tr>
        </thead>
        <tbody
          className={cn(
            /* typography */
            "text-xs font-mono"
          )}
        >
          {unsortedData.map((row, idx) => {
            const isResult = trace && trace.resultIdx === idx;
            const isCurrentStep =
              trace && currentStepIndex !== null && trace.steps[currentStepIndex]?.idx === idx;
            const isPastStep =
              trace &&
              currentStepIndex !== null &&
              trace.steps.slice(0, currentStepIndex + 1).some((s) => s.idx === idx);
            const currentStep = trace && currentStepIndex !== null ? trace.steps[currentStepIndex] : null;
            const rowNum = idx + 1;
            const isInRange = currentStep && rowNum >= currentStep.rangeStart && rowNum <= currentStep.rangeEnd;

            return (
              <tr
                key={idx}
                className={cn(
                  /* effect */
                  "transition-colors group",
                  isCurrentStep ? "bg-amber-100/50 dark:bg-amber-900/30" : "",
                  isInRange && !isCurrentStep ? "bg-blue-50/50 dark:bg-blue-900/20" : "",
                  isPastStep && !isCurrentStep && !isInRange ? "bg-zinc-50/30 dark:bg-zinc-900/20" : "",
                  isResult && !trace.isCorrect ? "bg-red-100/40 dark:bg-red-900/20" : ""
                )}
              >
                <td
                  className={cn(
                    /* border */
                    "border-r border-b border-zinc-200 dark:border-zinc-800",
                    /* typography */
                    "text-[10px] font-bold text-center select-none",
                    /* layout */
                    "w-10 min-w-[40px] py-2 relative",
                    isInRange
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                  )}
                >
                  {idx + 1}
                  {isInRange && !isCurrentStep && (
                    <span
                      className={cn(
                        /* layout */
                        "absolute left-0 top-0 bottom-0 w-1",
                        /* background */
                        "bg-blue-500"
                      )}
                    />
                  )}
                  {isCurrentStep && (
                    <span
                      className={cn(
                        /* layout */
                        "absolute left-0 top-0 bottom-0 w-1",
                        /* background */
                        "bg-amber-500"
                      )}
                    />
                  )}
                </td>
                <td
                  onClick={() => setActiveCell({ row: idx, col: "A" })}
                  className={cn(
                    /* layout */
                    "px-3 relative transition-all cursor-pointer",
                    /* border */
                    "border-r border-b border-zinc-100 dark:border-zinc-800",
                    /* interaction */
                    activeCell?.row === idx && activeCell?.col === "A"
                      ? "ring-2 ring-blue-500 ring-inset z-10 font-bold"
                      : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                    isResult &&
                      trace &&
                      (trace.isCorrect
                        ? "ring-2 ring-emerald-500 ring-inset"
                        : "ring-2 ring-red-500 ring-inset"),
                    isCurrentStep ? "ring-2 ring-amber-500 ring-inset font-bold" : "",
                    isInRange && !isCurrentStep ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  )}
                >
                  <motion.span
                    animate={isCurrentStep ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={cn(isInRange && !isCurrentStep ? "text-blue-600 dark:text-blue-400" : "")}
                  >
                    {row.id}
                  </motion.span>
                </td>
                <td
                  onClick={() => setActiveCell({ row: idx, col: "B" })}
                  className={cn(
                    /* layout */
                    "px-3 relative transition-all cursor-pointer",
                    /* border */
                    "border-r border-b border-zinc-100 dark:border-zinc-800",
                    /* interaction */
                    activeCell?.row === idx && activeCell?.col === "B"
                      ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-white dark:bg-zinc-900"
                      : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                    isResult &&
                      trace &&
                      (trace.isCorrect
                        ? "ring-2 ring-emerald-500 ring-inset"
                        : "ring-2 ring-red-500 ring-inset"),
                    isCurrentStep ? "ring-2 ring-amber-500 ring-inset font-bold" : "",
                    isInRange && !isCurrentStep ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  )}
                >
                  <span
                    className={cn(
                      activeCell?.row === idx && activeCell?.col === "B" ? "text-blue-500" : "",
                      isResult && !trace.isCorrect ? "text-red-600 dark:text-red-400 font-bold" : "",
                      isResult && trace.isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "",
                      isCurrentStep ? "text-amber-700 dark:text-amber-300" : "",
                      isInRange && !isCurrentStep ? "text-blue-600 dark:text-blue-400" : ""
                    )}
                  >
                    <motion.span
                      animate={isCurrentStep ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {row.name}
                    </motion.span>
                  </span>
                </td>
                <td
                  onClick={() => setActiveCell({ row: idx, col: "D" })}
                  className={cn(
                    /* layout */
                    "px-3 relative transition-all cursor-pointer",
                    /* border */
                    "border-r border-b border-zinc-100 dark:border-zinc-800",
                    idx === 0
                      ? "bg-zinc-50 dark:bg-zinc-900/50"
                      : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                    idx === 0 && activeCell?.col === "D"
                      ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-blue-50/30 dark:bg-blue-900/20"
                      : ""
                  )}
                >
                  {idx === 0 ? (
                    <span
                      className={cn(
                        "text-xs font-mono",
                        activeCell?.col === "D" && idx === 0
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : "text-zinc-700 dark:text-zinc-200"
                      )}
                    >
                      {lookupValue}
                    </span>
                  ) : (
                    <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                  )}
                </td>
                <td
                  onClick={() => setActiveCell({ row: idx, col: "E" })}
                  className={cn(
                    /* layout */
                    "px-3 relative transition-all cursor-pointer",
                    /* border */
                    "border-b border-zinc-100 dark:border-zinc-800",
                    idx === 0
                      ? "bg-zinc-50 dark:bg-zinc-900/50"
                      : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                    idx === 0 && activeCell?.col === "E"
                      ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-blue-50/30 dark:bg-blue-900/20"
                      : ""
                  )}
                >
                  {idx === 0 ? (
                    <span
                      className={cn(
                        "text-xs font-mono",
                        trace && !trace.isCorrect
                          ? "text-red-600 dark:text-red-400 font-bold"
                          : trace && trace.isCorrect
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : "text-zinc-400",
                        activeCell?.col === "E" && idx === 0 ? "text-blue-600 dark:text-blue-400" : ""
                      )}
                    >
                      {resultCellValue || "#N/A"}
                    </span>
                  ) : (
                    <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

