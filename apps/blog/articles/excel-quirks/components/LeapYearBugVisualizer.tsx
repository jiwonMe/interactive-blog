"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { CalendarDays, Info } from "lucide-react";

/**
 * 1900년 윤년 버그 시각화 (Spreadsheet Grid Style)
 */
export function LeapYearBugVisualizer() {
  const [activeRow, setActiveIdx] = useState<number>(1);

  const data = [
    { date: "1900-02-28", serial: 59, actual: "화요일", excel: "화요일", reality: "EXIST" },
    { date: "1900-02-29", serial: 60, actual: "존재하지 않음", excel: "수요일", reality: "NONE" },
    { date: "1900-03-01", serial: 61, actual: "목요일", excel: "목요일", reality: "EXIST" },
  ];

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Leap Year Analyzer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-blue-500 uppercase">Interactive Grid</span>
        </div>
      </div>

      {/* Spreadsheet Header */}
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          A{activeRow + 1}
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono text-zinc-500 truncate min-h-[24px]">
          =DATE(1900, 2, {28 + activeRow})
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
            <tr>
              <th className="w-10 min-w-[40px] border-r border-b border-zinc-200 dark:border-zinc-800"></th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 text-center tracking-tight">A (Input Date)</th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 text-center tracking-tight">B (Actual)</th>
              <th className="px-3 py-1 border-b border-zinc-200 dark:border-zinc-800 text-center tracking-tight text-[9px]">C (Excel Stored)</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {data.map((row, idx) => (
              <tr 
                key={idx} 
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "group cursor-pointer transition-colors",
                  activeRow === idx ? "bg-blue-50/40 dark:bg-blue-900/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                )}
              >
                <td className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center py-3 w-10 min-w-[40px] select-none">{idx + 1}</td>
                <td className={cn(
                  "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 text-center transition-all",
                  activeRow === idx ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-white dark:bg-zinc-900" : ""
                )}>
                  {row.date}
                </td>
                <td className={cn(
                  "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 text-center",
                  row.reality === 'NONE' ? "text-red-400 font-bold bg-red-50/10 dark:bg-red-950/10" : "text-zinc-500"
                )}>
                  {row.actual}
                </td>
                <td className={cn(
                  "px-3 border-b border-zinc-100 dark:border-zinc-800 text-center font-bold",
                  activeRow === idx ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                )}>
                  {row.excel} <span className="text-[9px] font-normal opacity-60">(SN:{row.serial})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 flex gap-2 items-start border-t border-zinc-200 dark:border-zinc-800">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
          각 행을 클릭해 보세요. 엑셀은 1900-01-01부터의 일수를 정수(Serial Number)로 관리합니다. 60번을 결번으로 처리할 수 없기에 실제로는 없는 2월 29일을 가상으로 유지하고 있습니다.
        </p>
      </div>
    </div>
  );
}
