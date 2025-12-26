"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "../../../lib/utils";
import { Search, Target } from "lucide-react";
import { motion } from "framer-motion";
import { DataItem, TraceInfo } from "./VlookupDefaultRisk.types";
import { VlookupTracer } from "./VlookupTracer";
import { VlookupGrid } from "./VlookupGrid";

/**
 * VLOOKUP 기본값(TRUE) 시뮬레이터 (Enhanced Affordance)
 */
export function VlookupDefaultRisk() {
  const [lookupValue, setLookupValue] = useState(103);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: "A" | "B" | "D" | "E";
  } | null>({ row: 0, col: "E" });
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const unsortedData: DataItem[] = [
    { id: 101, name: "Apple" },
    { id: 105, name: "Banana" },
    { id: 102, name: "Cherry" },
    { id: 104, name: "Dragonfruit" },
    { id: 103, name: "Elderberry" },
  ];

  const getTraceInfo = () => {
    const traces: Record<number, TraceInfo> = {
      101: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 0, label: "2단계", msg: "102 > 101 → 왼쪽 검색", rangeStart: 1, rangeEnd: 2 },
          { idx: 0, label: "결과", msg: "1행=101 발견! ✓", rangeStart: 1, rangeEnd: 1 },
        ],
        resultIdx: 0,
        resultName: "Apple",
        correctName: "Apple",
        isCorrect: true,
      },
      103: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 3, label: "2단계", msg: "102 < 103 → 오른쪽 검색", rangeStart: 4, rangeEnd: 5 },
          { idx: 3, label: "3단계", msg: "중간(4행=104) 확인", rangeStart: 4, rangeEnd: 5 },
          { idx: 2, label: "결과", msg: "104 > 103 → 이전 값 3행 반환 ✗", rangeStart: 3, rangeEnd: 3 },
        ],
        resultIdx: 2,
        resultName: "Cherry",
        correctName: "Elderberry",
        isCorrect: false,
      },
      105: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 3, label: "2단계", msg: "102 < 105 → 오른쪽 검색", rangeStart: 4, rangeEnd: 5 },
          { idx: 3, label: "3단계", msg: "중간(4행=104) 확인", rangeStart: 4, rangeEnd: 5 },
          { idx: 1, label: "결과", msg: "104 < 105 → 2행=105 발견! ✓", rangeStart: 2, rangeEnd: 2 },
        ],
        resultIdx: 1,
        resultName: "Banana",
        correctName: "Banana",
        isCorrect: true,
      },
    };
    return traces[lookupValue] || null;
  };

  const trace = useMemo(() => getTraceInfo(), [lookupValue]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trace) {
      setCurrentStepIndex(null);
      return;
    }

    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setCurrentStepIndex(0);

    if (trace.steps.length <= 1) {
      setIsPlaying(false);
      return;
    }

    let currentStep = 0;
    intervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= trace.steps.length) {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      setCurrentStepIndex(currentStep);
    }, 1500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [trace, isPlaying]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(null);
  }, [lookupValue]);

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
        <div className="flex items-center gap-1.5">
          <Search className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lookup Tracer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
            Binary Search Mode
          </span>
        </div>
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
          {activeCell ? `${activeCell.col}${activeCell.row + 1}` : "E1"}
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
            "text-xs font-mono truncate"
          )}
        >
          {activeCell?.col === "A"
            ? unsortedData[activeCell.row].id
            : activeCell?.col === "B"
              ? unsortedData[activeCell.row].name
              : activeCell?.col === "D"
                ? lookupValue
                : activeCell?.col === "E"
                  ? `=VLOOKUP(D1, A1:B5, 2, TRUE)`
                  : `=VLOOKUP(D1, A1:B5, 2, TRUE)`}
        </div>
      </div>

      <VlookupGrid
        unsortedData={unsortedData}
        trace={trace}
        currentStepIndex={currentStepIndex}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        lookupValue={lookupValue}
      />

      <VlookupTracer
        trace={trace}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        handlePlay={() => setIsPlaying(true)}
        handlePause={() => setIsPlaying(false)}
        handleReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(null);
        }}
      />

      {/* Control Footer */}
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Target className="w-2.5 h-2.5" />
              D1 값 변경:
            </span>
            <div className="flex gap-1">
              {[101, 103, 105].map((id) => (
                <button
                  key={id}
                  onClick={() => setLookupValue(id)}
                  className={cn(
                    "px-3 py-0.5 rounded-[1px] text-[10px] font-bold border transition-all relative",
                    lookupValue === id
                      ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200 shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400"
                  )}
                >
                  {id}
                  {id === 103 && lookupValue !== 103 && (
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-zinc-400 italic flex-1">
            {lookupValue === 103
              ? "103을 찾지만 정렬 안 된 데이터에서 102(Cherry)를 반환합니다. 실제 103은 5행에 있습니다!"
              : lookupValue === 101
                ? "101은 첫 번째에 있어서 우연히 올바르게 찾습니다."
                : lookupValue === 105
                  ? "105도 우연히 찾지만, 정렬되지 않은 데이터에서는 항상 신뢰할 수 없습니다."
                  : "ID를 선택하여 Binary Search의 동작을 관찰해 보세요."}
          </p>
        </div>
      </div>
    </div>
  );
}
