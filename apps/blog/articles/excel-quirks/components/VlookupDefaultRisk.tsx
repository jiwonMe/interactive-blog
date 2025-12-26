"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "../../../lib/utils";
import { Search, MousePointer2, Target, Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VLOOKUP 기본값(TRUE) 시뮬레이터 (Enhanced Affordance)
 */
export function VlookupDefaultRisk() {
  const [lookupValue, setLookupValue] = useState(103);
  const [activeCell, setActiveCell] = useState<{row: number, col: 'A'|'B'|'D'|'E'} | null>({row: 0, col: 'E'});
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const unsortedData = [
    { id: 101, name: "Apple" },
    { id: 105, name: "Banana" },
    { id: 102, name: "Cherry" },
    { id: 104, name: "Dragonfruit" },
    { id: 103, name: "Elderberry" },
  ];

  /**
   * Binary Search 시뮬레이션 (정렬되지 않은 데이터에서의 잘못된 동작)
   * 
   * VLOOKUP(lookup_value, range, col, TRUE)는 데이터가 오름차순 정렬되어 있다고 가정합니다.
   * 정렬되지 않은 데이터에서는 예측 불가능한 결과가 나옵니다.
   * 
   * 데이터 순서: [101, 105, 102, 104, 103] (정렬 안 됨)
   * 행 번호:     [  1 ,  2 ,  3 ,  4 ,  5 ] (1-based)
   */
  const getTraceInfo = () => {
    const traces: Record<number, { 
      steps: Array<{idx: number, label: string, msg: string, rangeStart: number, rangeEnd: number}>, 
      resultIdx: number, 
      resultName: string, 
      isCorrect: boolean, 
      correctName: string
    }> = {
      101: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 0, label: "2단계", msg: "102 > 101 → 왼쪽 검색", rangeStart: 1, rangeEnd: 2 },
          { idx: 0, label: "결과", msg: "1행=101 발견! ✓", rangeStart: 1, rangeEnd: 1 }
        ],
        resultIdx: 0,
        resultName: "Apple",
        correctName: "Apple",
        isCorrect: true
      },
      103: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 3, label: "2단계", msg: "102 < 103 → 오른쪽 검색", rangeStart: 4, rangeEnd: 5 },
          { idx: 3, label: "3단계", msg: "중간(4행=104) 확인", rangeStart: 4, rangeEnd: 5 },
          { idx: 2, label: "결과", msg: "104 > 103 → 이전 값 3행 반환 ✗", rangeStart: 3, rangeEnd: 3 }
        ],
        resultIdx: 2,
        resultName: "Cherry",
        correctName: "Elderberry",
        isCorrect: false
      },
      105: {
        steps: [
          { idx: 2, label: "1단계", msg: "중간(3행=102) 확인", rangeStart: 1, rangeEnd: 5 },
          { idx: 3, label: "2단계", msg: "102 < 105 → 오른쪽 검색", rangeStart: 4, rangeEnd: 5 },
          { idx: 3, label: "3단계", msg: "중간(4행=104) 확인", rangeStart: 4, rangeEnd: 5 },
          { idx: 1, label: "결과", msg: "104 < 105 → 2행=105 발견! ✓", rangeStart: 2, rangeEnd: 2 }
        ],
        resultIdx: 1,
        resultName: "Banana",
        correctName: "Banana",
        isCorrect: true
      }
    };
    return traces[lookupValue] || null;
  };

  const trace = useMemo(() => getTraceInfo(), [lookupValue]);
  const resultCellValue = trace ? unsortedData[trace.resultIdx].name : null;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 애니메이션 자동 재생
  useEffect(() => {
    if (!trace) {
      setCurrentStepIndex(null);
      return;
    }

    if (!isPlaying) {
      // 일시정지 시 인터벌 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 첫 번째 단계를 즉시 표시
    setCurrentStepIndex(0);
    
    // 두 번째 단계부터 interval로 진행
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
    }, 1500); // 1.5초마다 다음 단계

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [trace, isPlaying]);

  // lookupValue 변경 시 애니메이션 리셋
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(null);
  }, [lookupValue]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(null);
  };

  return (
    <div className="w-full my-6 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Interactive Badge */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
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
      <div className="p-1 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
        <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm min-w-[40px] text-center uppercase select-none">
          {activeCell ? `${activeCell.col}${activeCell.row + 1}` : "E1"}
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2 py-1 text-xs font-mono truncate min-h-[24px]">
          {activeCell?.col === 'A' 
            ? unsortedData[activeCell.row].id 
            : activeCell?.col === 'B' 
            ? unsortedData[activeCell.row].name 
            : activeCell?.col === 'D'
            ? lookupValue
            : activeCell?.col === 'E'
            ? `=VLOOKUP(D1, A1:B5, 2, TRUE)`
            : `=VLOOKUP(D1, A1:B5, 2, TRUE)`}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase select-none">
            <tr>
              <th className="w-10 min-w-[40px] border-r border-b border-zinc-200 dark:border-zinc-800"></th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-24">A (Product ID)</th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-32">B (Product Name)</th>
              <th className="px-3 py-1 border-r border-b border-zinc-200 dark:border-zinc-800 w-24">D (Lookup ID)</th>
              <th className="px-3 py-1 border-b border-zinc-200 dark:border-zinc-800 w-32">E (Result)</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {unsortedData.map((row, idx) => {
              const step = trace?.steps.find(s => s.idx === idx);
              const isResult = trace && trace.resultIdx === idx;
              const isCurrentStep = trace && currentStepIndex !== null && trace.steps[currentStepIndex]?.idx === idx;
              const isPastStep = trace && currentStepIndex !== null && trace.steps.slice(0, currentStepIndex + 1).some(s => s.idx === idx);
              
              // 현재 검색 범위 확인 (1-based index)
              const currentStep = trace && currentStepIndex !== null ? trace.steps[currentStepIndex] : null;
              const rowNum = idx + 1; // 1-based row number
              const isInRange = currentStep && rowNum >= currentStep.rangeStart && rowNum <= currentStep.rangeEnd;
              
              return (
                <tr key={idx} className={cn(
                  "transition-colors group",
                  isCurrentStep ? "bg-amber-100/50 dark:bg-amber-900/30" : "",
                  isInRange && !isCurrentStep ? "bg-blue-50/50 dark:bg-blue-900/20" : "",
                  isPastStep && !isCurrentStep && !isInRange ? "bg-zinc-50/30 dark:bg-zinc-900/20" : "",
                  isResult && !trace.isCorrect ? "bg-red-100/40 dark:bg-red-900/20" : ""
                )}>
                  <td className={cn(
                    "border-r border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-center py-2 select-none w-10 min-w-[40px] relative",
                    isInRange ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                  )}>
                    {idx + 1}
                    {isInRange && !isCurrentStep && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                    {isCurrentStep && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    )}
                  </td>
                  <td 
                    onClick={() => setActiveCell({row: idx, col: 'A'})}
                    className={cn(
                      "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 relative transition-all cursor-pointer",
                      activeCell?.row === idx && activeCell?.col === 'A' ? "ring-2 ring-blue-500 ring-inset z-10 font-bold" : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                      isResult && trace && (trace.isCorrect ? "ring-2 ring-emerald-500 ring-inset" : "ring-2 ring-red-500 ring-inset"),
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
                    {isCurrentStep && (
                      <motion.span
                        className="absolute -right-1 -top-1 w-3 h-3 bg-amber-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                    {isResult && trace && !isCurrentStep && (
                      <span className={cn(
                        "absolute -right-1 -top-1 w-2 h-2 rounded-full",
                        trace.isCorrect ? "bg-emerald-500" : "bg-red-500"
                      )} />
                    )}
                  </td>
                  <td 
                    onClick={() => setActiveCell({row: idx, col: 'B'})}
                    className={cn(
                      "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 transition-all cursor-pointer relative",
                      activeCell?.row === idx && activeCell?.col === 'B' ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-white dark:bg-zinc-900" : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                      isResult && trace && (trace.isCorrect ? "ring-2 ring-emerald-500 ring-inset" : "ring-2 ring-red-500 ring-inset"),
                      isCurrentStep ? "ring-2 ring-amber-500 ring-inset font-bold" : "",
                      isInRange && !isCurrentStep ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    )}
                  >
                    <span className={cn(
                      activeCell?.row === idx && activeCell?.col === 'B' ? "text-blue-500" : "",
                      isResult && !trace.isCorrect ? "text-red-600 dark:text-red-400 font-bold" : "",
                      isResult && trace.isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "",
                      isCurrentStep ? "text-amber-700 dark:text-amber-300" : "",
                      isInRange && !isCurrentStep ? "text-blue-600 dark:text-blue-400" : ""
                    )}>
                      <motion.span
                        animate={isCurrentStep ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {row.name}
                      </motion.span>
                      {isResult && (
                        <span className={cn(
                          "ml-2 text-[9px] px-1.5 py-0.5 rounded-[1px] font-bold uppercase",
                          trace.isCorrect ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        )}>
                          {trace.isCorrect ? "✓ 정확" : "✗ 오류"}
                        </span>
                      )}
                    </span>
                  </td>
                  <td 
                    onClick={() => setActiveCell({row: idx, col: 'D'})}
                    className={cn(
                      "px-3 border-r border-b border-zinc-100 dark:border-zinc-800 transition-all cursor-pointer relative",
                      idx === 0 ? "bg-zinc-50 dark:bg-zinc-900/50" : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                      idx === 0 && activeCell?.col === 'D' ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-blue-50/30 dark:bg-blue-900/20" : ""
                    )}
                  >
                    {idx === 0 ? (
                      <span className={cn(
                        "text-xs font-mono",
                        activeCell?.col === 'D' && idx === 0 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-zinc-700 dark:text-zinc-200"
                      )}>
                        {lookupValue}
                      </span>
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                    )}
                  </td>
                  <td 
                    onClick={() => setActiveCell({row: idx, col: 'E'})}
                    className={cn(
                      "px-3 border-b border-zinc-100 dark:border-zinc-800 transition-all cursor-pointer relative",
                      idx === 0 ? "bg-zinc-50 dark:bg-zinc-900/50" : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/30",
                      idx === 0 && activeCell?.col === 'E' ? "ring-2 ring-blue-500 ring-inset z-10 font-bold bg-blue-50/30 dark:bg-blue-900/20" : ""
                    )}
                  >
                    {idx === 0 ? (
                      <span className={cn(
                        "text-xs font-mono",
                        trace && !trace.isCorrect ? "text-red-600 dark:text-red-400 font-bold" : trace && trace.isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400",
                        activeCell?.col === 'E' && idx === 0 ? "text-blue-600 dark:text-blue-400" : ""
                      )}>
                        {resultCellValue || "#N/A"}
                        {trace && (
                          <span className={cn(
                            "ml-2 text-[9px] px-1.5 py-0.5 rounded-[1px] font-bold uppercase",
                            trace.isCorrect ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          )}>
                            {trace.isCorrect ? "✓" : "✗"}
                          </span>
                        )}
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

      {/* Binary Search Trace Section */}
      {trace && trace.steps.length > 0 && (
        <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Binary Search 과정:</span>
            <div className="flex items-center gap-1">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5" />
                  재생
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 flex items-center gap-1"
                >
                  <Pause className="w-2.5 h-2.5" />
                  일시정지
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-2 py-0.5 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                리셋
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="wait">
              {trace.steps.map((step, stepIdx) => {
                const isActive = currentStepIndex === stepIdx;
                const isPast = currentStepIndex !== null && stepIdx < currentStepIndex;
                return (
                  <motion.div
                    key={stepIdx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isActive || isPast ? 1 : 0.4,
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? "rgb(245 158 11)" : undefined
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-center gap-2 bg-white dark:bg-zinc-800 border rounded-sm px-2 py-1.5 transition-all",
                      isActive ? "border-amber-500 shadow-md ring-2 ring-amber-500/20" : "border-zinc-200 dark:border-zinc-700",
                      isPast && !isActive ? "opacity-60" : "",
                      step.label === '결과' && trace.isCorrect ? "bg-emerald-50 dark:bg-emerald-900/20" : "",
                      step.label === '결과' && !trace.isCorrect ? "bg-red-50 dark:bg-red-900/20" : ""
                    )}
                  >
                    <span className={cn(
                      "text-[8px] px-1.5 py-0.5 rounded-[1px] font-bold text-white shrink-0",
                      step.label === '결과' ? (trace.isCorrect ? "bg-emerald-500 shadow-sm" : "bg-red-500 shadow-sm") : isActive ? "bg-amber-500" : "bg-zinc-400 dark:bg-zinc-600"
                    )}>
                      {step.label}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800",
                      isActive ? "text-blue-700 dark:text-blue-300" : "text-blue-500"
                    )}>
                      {step.rangeStart === step.rangeEnd 
                        ? `${step.rangeStart}행` 
                        : `${step.rangeStart}~${step.rangeEnd}행`}
                    </span>
                    <span className={cn(
                      "text-[10px] font-mono font-bold",
                      isActive ? "text-amber-700 dark:text-amber-300" : "text-zinc-600 dark:text-zinc-300"
                    )}>
                      →A{step.idx + 1}
                    </span>
                    <span className={cn(
                      "text-[10px] truncate",
                      isActive ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400",
                      step.label === '결과' && trace.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "",
                      step.label === '결과' && !trace.isCorrect ? "text-red-600 dark:text-red-400" : ""
                    )}>
                      {step.msg}
                    </span>
                    {isActive && step.label !== '결과' && (
                      <motion.span
                        className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Result Display */}
      {trace && (
        <div className={cn(
          "px-3 py-2 border-t border-zinc-200 dark:border-zinc-800",
          trace.isCorrect ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-red-50/50 dark:bg-red-900/10"
        )}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest",
              trace.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {trace.isCorrect ? "✓ 결과:" : "✗ 잘못된 결과:"}
            </span>
            <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-200">
              E1 = &quot;{trace.resultName}&quot;
            </span>
            {!trace.isCorrect && (
              <span className="text-[9px] text-red-500 font-bold">
                (정확한 값: &quot;{trace.correctName}&quot;)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Control Footer */}
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Target className="w-2.5 h-2.5" />
              D1 값 변경:
            </span>
            <div className="flex gap-1">
              {[101, 103, 105].map(id => (
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
                    <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
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
