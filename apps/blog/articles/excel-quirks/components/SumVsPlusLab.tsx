"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { PencilLine, Calculator } from "lucide-react";

/**
 * 직접 편집 가능한 셀을 포함한 엑셀 스타일 컴포넌트
 */
export function SumVsPlusLab() {
  const [cells, setCells] = useState([
    { id: "A1", value: "10", type: "number" },
    { id: "A2", value: "\"20\"", type: "text" },
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
    setCells(prev => prev.map(cell => {
      if (cell.id === id) {
        // 엑셀처럼 "20" 이라고 입력하면 텍스트로 인식하도록 처리
        if (newValue.startsWith("'")) {
          return { ...cell, value: newValue.substring(1), type: "text" };
        }
        const isNum = !isNaN(Number(newValue)) && newValue.trim() !== "";
        return { ...cell, value: newValue, type: isNum ? "number" : "text" };
      }
      return cell;
    }));
  };

  const sumResult = cells.reduce((acc, cell) => {
    // 엑셀의 SUM 함수는 셀 참조 시 텍스트가 포함된 셀을 무시합니다.
    if (cell.type === "text") return acc;
    const val = Number(cell.value);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const plusResult = (() => {
    let res = 0;
    for (const cell of cells) {
      // 엑셀에서 + 연산자로 셀을 참조할 때, 셀에 텍스트가 들어있으면 #VALUE! 에러가 발생합니다.
      // (직접 "1"+1 수식을 쓰는 것과 셀 참조 A1+A2는 다르게 동작함)
      if (cell.type === "text") return "#VALUE!";
      const val = Number(cell.value);
      if (isNaN(val) || cell.value.trim() === "") return "#VALUE!";
      res += val;
    }
    return res.toString();
  })();

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Interactive Sheet</span>
        </div>
        <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
          실시간 계산 중
        </span>
      </div>

      {/* Formula Bar */}
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          {activeCell || " "}
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono text-zinc-500 truncate min-h-[24px]">
          {editingId 
            ? (cells.find(c => c.id === editingId)?.type === 'text' && !isNaN(Number(cells.find(c => c.id === editingId)?.value)) 
                ? `'${cells.find(c => c.id === editingId)?.value}` 
                : cells.find(c => c.id === editingId)?.value)
            : activeCell === 'B1' ? "=SUM(A1:A3)" : activeCell === 'B2' ? "=A1+A2+A3" : activeCell ? (cells.find(c => c.id === activeCell)?.type === 'text' && !isNaN(Number(cells.find(c => c.id === activeCell)?.value)) ? `'${cells.find(c => c.id === activeCell)?.value}` : cells.find(c => c.id === activeCell)?.value) : ""}
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
            <tr>
              <th className="w-10 min-w-[40px] border-r border-b border-zinc-200 dark:border-zinc-800"></th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-1/2 text-center tracking-widest">A (Input)</th>
              <th className="px-3 py-1 border-b border-zinc-200 dark:border-zinc-800 w-1/2 text-center tracking-widest text-[9px]">B (Calculation)</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {cells.map((cell, i) => (
              <tr key={cell.id}>
                <td className="bg-zinc-100 dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-center py-2 select-none w-10 min-w-[40px]">{i + 1}</td>
                {/* Column A (Editable) */}
                <td 
                  onClick={() => { setActiveCell(cell.id); setEditingId(cell.id); }}
                  className={cn(
                    "group px-3 border-r border-b border-zinc-100 dark:border-zinc-800 relative h-10 cursor-text transition-all",
                    activeCell === cell.id ? "ring-2 ring-blue-500 ring-inset z-10 bg-white dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
                    /* Affordance: Subtle background for editable cells */
                    "bg-blue-50/5 dark:bg-blue-900/5"
                  )}
                >
                  {editingId === cell.id ? (
                    <input
                      ref={inputRef}
                      value={cell.value}
                      onChange={(e) => handleCellChange(cell.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                      className="absolute inset-0 w-full h-full px-3 bg-transparent outline-none text-right"
                    />
                  ) : (
                    <>
                      <span className={cn(
                        "block w-full text-right", 
                        cell.type === 'text' 
                          ? "text-red-500 font-bold italic bg-red-50/10" 
                          : "text-zinc-800 dark:text-zinc-200"
                      )}>
                        {cell.type === 'text' && !isNaN(Number(cell.value)) ? `'${cell.value}` : cell.value}
                      </span>
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PencilLine className="w-2.5 h-2.5 text-blue-500" />
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">Edit</span>
                      </div>
                    </>
                  )}
                </td>
                {/* Column B (Calculations) */}
                <td 
                  onClick={() => { setActiveCell(`B${i+1}`); setEditingId(null); }}
                  className={cn(
                    "px-3 border-b border-zinc-100 dark:border-zinc-800 relative h-10 cursor-pointer transition-all bg-zinc-50/20 dark:bg-zinc-900/10",
                    activeCell === `B${i+1}` ? "ring-2 ring-blue-500 ring-inset z-10" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                  )}
                >
                  {i === 0 && (
                    <div className="flex justify-between items-center w-full h-full">
                      <span className="text-[8px] font-bold text-emerald-500/60 uppercase select-none">SUM</span>
                      <span className="text-right font-bold text-emerald-600">{sumResult}</span>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="flex justify-between items-center w-full h-full">
                      <span className="text-[8px] font-bold text-blue-500/60 uppercase select-none">PLUS</span>
                      <span className={cn("text-right font-bold", plusResult === "#VALUE!" ? "text-red-500" : "text-blue-600")}>{plusResult}</span>
                    </div>
                  )}
                  {i > 1 && <span className="block w-full text-right text-zinc-200 dark:text-zinc-800">--</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Help Footer */}
      <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug flex items-center gap-1.5">
          <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
          A2 셀처럼 숫자 앞에 작은따옴표(&apos;)를 붙이면 텍스트로 인식됩니다. SUM은 이 셀을 무시하지만, + 연산자는 셀 참조 시 #VALUE! 에러를 발생시킵니다.
        </p>
      </div>
    </div>
  );
}
