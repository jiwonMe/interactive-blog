"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { FileWarning, CheckCircle2, FlaskConical, MousePointerClick } from "lucide-react";

/**
 * 유전자 이름 변환 데모 (Enhanced Affordance)
 */
export function GeneNameAutoCorrectDemo() {
  const [showAutoCorrect, setShowAutoCorrect] = useState(true);
  const [activeRow, setActiveRow] = useState<number | null>(1);
  
  const genes = [
    { sym: "BRCA1", desc: "Breast Cancer 1" },
    { sym: "SEPT1", desc: "Septin 1" },
    { sym: "MARCH1", desc: "Membrane Associated Finger 1" },
    { sym: "OCT4", desc: "POU Class 5 Homeobox 1" },
    { sym: "TP53", desc: "Tumor Protein p53" },
  ];

  const getDisplayValue = (sym: string) => {
    if (!showAutoCorrect) return sym;
    if (sym === "SEPT1") return "9월 1일";
    if (sym === "MARCH1") return "3월 1일";
    if (sym === "OCT4") return "10월 4일";
    return sym;
  };

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gene Import Sim</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAutoCorrect(!showAutoCorrect)}
            className={cn(
              "px-2 py-0.5 rounded-[1px] text-[9px] font-bold border transition-all uppercase flex items-center gap-1",
              showAutoCorrect 
                ? "bg-red-600 text-white border-red-700 shadow-sm" 
                : "bg-emerald-600 text-white border-emerald-700 shadow-sm"
            )}
          >
            {showAutoCorrect ? <FileWarning className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
            {showAutoCorrect ? "Restore Data" : "Open in Excel"}
          </button>
        </div>
      </div>

      {/* Excel Formula Bar */}
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          {activeRow !== null ? `A${activeRow + 1}` : " "}
        </div>
        <div className={cn(
          "flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono truncate min-h-[24px]",
          activeRow !== null && showAutoCorrect && getDisplayValue(genes[activeRow].sym).includes('월')
            ? "text-zinc-900 dark:text-zinc-100 font-bold"
            : "text-zinc-500"
        )}>
          {activeRow !== null ? genes[activeRow].sym : "Select a cell to see the raw value"}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
            <tr>
              <th className="w-10 min-w-[40px] border-r border-b border-zinc-200 dark:border-zinc-800"></th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-32 tracking-tight">A (Gene Symbol)</th>
              <th className="px-3 py-1 border-b border-zinc-200 dark:border-zinc-800 tracking-tight text-[9px]">B (Description)</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {genes.map((gene, idx) => (
              <tr key={idx} onClick={() => setActiveRow(idx)} className="cursor-pointer group">
                <td className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center py-2 select-none w-10 min-w-[40px]">{idx + 1}</td>
                <td className={cn(
                  "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 relative transition-all",
                  activeRow === idx ? "ring-2 ring-blue-500 ring-inset z-10 bg-blue-50/5 dark:bg-blue-900/5" : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30"
                )}>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "transition-all",
                      showAutoCorrect && getDisplayValue(gene.sym).includes('월') ? "text-red-500 font-bold underline decoration-dotted" : "text-zinc-700 dark:text-zinc-200"
                    )}>
                      {getDisplayValue(gene.sym)}
                    </span>
                    {activeRow === idx && !showAutoCorrect && (
                      <span className="text-[8px] font-bold text-blue-500 opacity-40 uppercase tracking-tighter">Selected</span>
                    )}
                  </div>
                </td>
                <td className={cn(
                  "px-3 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 italic transition-all",
                  activeRow === idx ? "bg-zinc-50 dark:bg-zinc-900/50" : ""
                )}>
                  {gene.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Footer */}
      <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-500 leading-snug flex items-center gap-1.5">
          <MousePointerClick className="w-2.5 h-2.5 text-zinc-400" />
          우측 상단의 &quot;Open in Excel&quot; 버튼을 클릭하여 유전자 이름이 어떻게 날짜로 변하는지 관찰해 보세요.
        </p>
      </div>
    </div>
  );
}
