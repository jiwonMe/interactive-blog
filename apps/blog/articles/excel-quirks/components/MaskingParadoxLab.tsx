"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { PencilLine, ShieldAlert, Binary } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 엑셀의 보정 로직 역설 실험실 (Enhanced Affordance)
 */
export function MaskingParadoxLab() {
  const [activeCell, setActiveCell] = useState<'A1' | 'B1' | 'C1' | 'C2' | null>('C1');
  const [valA, setValA] = useState("0.1+0.2");
  const [valB, setValB] = useState("0.3");
  const [editingId, setEditingId] = useState<'A1' | 'B1' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const evaluate = (input: string): number => {
    try {
      if (input.includes('+')) {
        const parts = input.split('+').map(p => parseFloat(p.trim()));
        return parts.reduce((a, b) => a + b, 0);
      }
      return parseFloat(input);
    } catch { return 0; }
  };

  const numA = evaluate(valA);
  const numB = evaluate(valB);
  const isExcelEqual = Math.abs(numA - numB) < 1e-15;
  const realDiff = numA - numB;

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Binary className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Equality Paradox Lab</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Active Simulation</span>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          {activeCell || " "}
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono text-zinc-500 truncate min-h-[24px]">
          {activeCell === 'C1' ? "=A1=B1" : activeCell === 'C2' ? "=A1-B1=0" : activeCell === 'A1' ? valA : activeCell === 'B1' ? valB : ""}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
            <tr>
              <th className="w-10 min-w-[40px] border-r border-b border-zinc-200 dark:border-zinc-800"></th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-1/3 text-center tracking-widest">A</th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-1/3 text-center tracking-widest">B</th>
              <th className="px-3 py-1 border-b border-zinc-200 dark:border-zinc-800 w-1/3 text-center tracking-tighter text-[9px]">C (Paradox)</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {/* Row 1 */}
            <tr>
              <td className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center py-2 w-10 min-w-[40px] select-none">1</td>
              <td 
                onClick={() => { setActiveCell('A1'); setEditingId('A1'); }}
                className={cn("group px-3 border-r border-b border-zinc-100 dark:border-zinc-800 relative h-10 transition-all", activeCell === 'A1' ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30 bg-blue-50/5")}
              >
                {editingId === 'A1' ? (
                  <input ref={inputRef} value={valA} onChange={(e) => setValA(e.target.value)} onBlur={() => setEditingId(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)} className="absolute inset-0 w-full h-full px-3 bg-transparent outline-none text-right" />
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <PencilLine className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-right flex-1">{numA.toFixed(1)}</span>
                  </div>
                )}
              </td>
              <td 
                onClick={() => { setActiveCell('B1'); setEditingId('B1'); }}
                className={cn("group px-3 border-r border-b border-zinc-100 dark:border-zinc-800 relative h-10 transition-all", activeCell === 'B1' ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30 bg-blue-50/5")}
              >
                {editingId === 'B1' ? (
                  <input ref={inputRef} value={valB} onChange={(e) => setValB(e.target.value)} onBlur={() => setEditingId(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)} className="absolute inset-0 w-full h-full px-3 bg-transparent outline-none text-right" />
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <PencilLine className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-right flex-1">{numB.toFixed(1)}</span>
                  </div>
                )}
              </td>
              <td 
                onClick={() => { setActiveCell('C1'); setEditingId(null); }}
                className={cn("px-3 border-b border-zinc-100 dark:border-zinc-800 relative h-10 transition-all cursor-pointer", activeCell === 'C1' ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "bg-emerald-50/10 dark:bg-emerald-900/5 hover:bg-emerald-50/20")}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[8px] font-bold text-emerald-500 uppercase opacity-60 select-none tracking-tighter">Comparison</span>
                  <span className={cn("font-bold", isExcelEqual ? "text-emerald-600" : "text-red-500")}>{isExcelEqual ? "TRUE" : "FALSE"}</span>
                </div>
              </td>
            </tr>
            {/* Row 2 */}
            <tr>
              <td className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center py-2 w-10 min-w-[40px] select-none">2</td>
              <td className="border-r border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/50"></td>
              <td className="border-r border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/50"></td>
              <td 
                onClick={() => { setActiveCell('C2'); setEditingId(null); }}
                className={cn("px-3 border-b border-zinc-100 dark:border-zinc-800 relative h-10 transition-all cursor-pointer", activeCell === 'C2' ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "bg-red-50/10 dark:bg-red-900/5 hover:bg-red-50/20")}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[8px] font-bold text-red-500 uppercase opacity-60 select-none tracking-tighter">Internal Diff</span>
                  <span className={cn("font-bold", realDiff === 0 ? "text-emerald-600" : "text-red-500")}>{realDiff === 0 ? "TRUE" : "FALSE"}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Debug Info Footer */}
      <div className="p-2 bg-zinc-900 dark:bg-black text-[10px] font-mono text-zinc-500 border-t border-zinc-800 flex items-center justify-between px-3">
        <div className="flex gap-2 items-center">
          <ShieldAlert className="w-3 h-3 text-red-500/60" />
          <span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">Binary Debug:</span>
        </div>
        <span className="text-zinc-400 select-all">
          {numA.toPrecision(21)}
        </span>
      </div>
    </div>
  );
}
