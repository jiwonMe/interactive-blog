"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { Cpu, MousePointer2, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 부동 소수점 오차 시뮬레이션 (Enhanced Affordance)
 */
export function ExcelFloatingPointDemo() {
  const [activeCell, setActiveCell] = useState<'A1' | 'B1' | 'C1' | null>(null);

  const data = {
    A1: { display: "0.1", internal: "0.10000000000000000555...", binary: "0.000110011..." },
    B1: { display: "0.2", internal: "0.20000000000000001110...", binary: "0.001100110..." },
    C1: { display: "0.3", internal: "0.30000000000000004440...", binary: "Error Accumulation" }
  };

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Microscope className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Floating Point Inspector</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-blue-500 uppercase">Live Probe</span>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          {activeCell || " "}
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono text-zinc-500 truncate min-h-[24px]">
          {activeCell === 'C1' ? "=A1+B1" : activeCell ? data[activeCell].display : "Select a cell to see the formula"}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
        <div className="border-r border-b border-zinc-200 dark:border-zinc-800 h-6 min-w-[40px]"></div>
        {['A', 'B', 'C'].map(col => (
          <div key={col} className="border-r border-b border-zinc-200 dark:border-zinc-800 text-center leading-6 tracking-widest">{col}</div>
        ))}
      </div>

      <div className="grid grid-cols-[40px_1fr_1fr_1fr] relative">
        <div className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center leading-10 min-w-[40px] select-none">1</div>
        {(['A1', 'B1', 'C1'] as const).map(id => (
          <div 
            key={id}
            onClick={() => setActiveCell(id)}
            className={cn(
              "group px-3 border-r border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-end font-mono text-sm relative transition-all h-10 cursor-pointer",
              activeCell === id ? "ring-2 ring-blue-500 ring-inset z-10 bg-blue-50/5" : "bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
            )}
          >
            <span className={cn(id === 'C1' ? "text-red-500 font-bold" : "text-zinc-800 dark:text-zinc-200")}>
              {data[id].display}
            </span>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <MousePointer2 className="w-2.5 h-2.5 text-blue-500" />
            </div>
            {!activeCell && id === 'A1' && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Internal Property Sheet */}
      <div className="min-h-[100px] border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 relative">
        <AnimatePresence mode="wait">
          {activeCell ? (
            <motion.div 
              key={activeCell}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Memory Analysis: {activeCell}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-[1px] bg-zinc-800 text-zinc-400 font-mono border border-zinc-700">64-BIT FLOAT</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Binary Representation:</span>
                  <span className="text-[11px] font-mono text-red-500 font-bold truncate ml-4 select-all">{data[activeCell].binary}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Raw Internal Value:</span>
                  <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 truncate ml-4 select-all">{data[activeCell].internal}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700">
              <MousePointer2 className="w-4 h-4 mb-2 opacity-20 animate-bounce" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Select a cell to investigate</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
