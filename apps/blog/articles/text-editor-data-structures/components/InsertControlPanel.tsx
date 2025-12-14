"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import type { AnimationPhase } from "./use-string-insert";

interface InsertControlPanelProps {
  originalText: string;
  setOriginalText: (value: string) => void;
  insertText: string;
  setInsertText: (value: string) => void;
  insertPosition: number;
  onRun: () => void;
  onReset: () => void;
  phase: AnimationPhase;
  copiedCount: number;
  stringLength: number;
}

/**
 * 삽입 시각화 제어 패널 (단순화된 버전)
 */
export function InsertControlPanel({
  originalText,
  setOriginalText,
  insertText,
  setInsertText,
  insertPosition,
  onRun,
  onReset,
  phase,
  copiedCount,
  stringLength,
}: InsertControlPanelProps) {
  const isRunning = phase !== "idle" && phase !== "complete";

  return (
    <div
      className={cn(
        // layout
        "space-y-4"
      )}
    >
      {/* 텍스트 입력 영역 */}
      <div
        className={cn(
          // layout
          "grid grid-cols-1 md:grid-cols-2 gap-4"
        )}
      >
        {/* 원본 문자열 */}
        <div className="space-y-1">
          <label
            className={cn(
              // typography
              "text-xs font-medium",
              // color
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            원본 문자열
          </label>
          <input
            type="text"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            disabled={isRunning}
            placeholder="Hello World"
            className={cn(
              // layout
              "w-full px-3 py-1.5 rounded-md",
              // typography
              "text-sm font-mono",
              // background
              "bg-white dark:bg-zinc-800",
              // border
              "border border-zinc-300 dark:border-zinc-600",
              // color
              "text-zinc-700 dark:text-zinc-300",
              // focus
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              // disabled
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>

        {/* 삽입할 텍스트 */}
        <div className="space-y-1">
          <label
            className={cn(
              // typography
              "text-xs font-medium",
              // color
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            삽입할 텍스트
          </label>
          <input
            type="text"
            value={insertText}
            onChange={(e) => setInsertText(e.target.value)}
            disabled={isRunning}
            placeholder="Beautiful "
            className={cn(
              // layout
              "w-full px-3 py-1.5 rounded-md",
              // typography
              "text-sm font-mono",
              // background
              "bg-white dark:bg-zinc-800",
              // border
              "border border-zinc-300 dark:border-zinc-600",
              // color
              "text-zinc-700 dark:text-zinc-300",
              // focus
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              // disabled
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>
      </div>

      {/* 버튼 및 상태 영역 */}
      <div
        className={cn(
          // layout
          "flex items-center gap-3 flex-wrap"
        )}
      >
        <button
          onClick={onRun}
          disabled={isRunning || insertText.length === 0 || stringLength === 0}
          className={cn(
            // layout
            "px-4 py-2 rounded-lg",
            // typography
            "text-sm font-medium",
            // background
            "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300",
            // color
            "text-white dark:text-zinc-900",
            // transition
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          ▶ 삽입 실행
        </button>

        <button
          onClick={onReset}
          className={cn(
            // layout
            "px-4 py-2 rounded-lg",
            // typography
            "text-sm font-medium",
            // background
            "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600",
            // color
            "text-zinc-700 dark:text-zinc-300",
            // transition
            "transition-colors"
          )}
        >
          초기화
        </button>

        {/* 삽입 위치 표시 */}
        <span
          className={cn(
            // layout
            "px-2 py-1 rounded",
            // background
            "bg-zinc-100 dark:bg-zinc-800",
            // typography
            "text-xs font-mono",
            // color
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          삽입 위치: {insertPosition}
        </span>

        {/* 상태 표시 */}
        <StatusDisplay
          phase={phase}
          copiedCount={copiedCount}
          totalCopyCost={stringLength}
        />
      </div>
    </div>
  );
}

interface StatusDisplayProps {
  phase: AnimationPhase;
  copiedCount: number;
  totalCopyCost: number;
}

/**
 * 상태 표시
 */
function StatusDisplay({ phase, copiedCount, totalCopyCost }: StatusDisplayProps) {
  const phaseLabels: Record<AnimationPhase, string> = {
    idle: "대기 중",
    allocate: "1단계: 새 배열 할당",
    "copy-before": "2단계: 앞부분 복사",
    insert: "3단계: 텍스트 삽입",
    "copy-after": "4단계: 뒷부분 복사",
    complete: "완료",
  };

  if (phase === "idle") return null;

  return (
    <div
      className={cn(
        // layout
        "flex-1 flex items-center justify-end gap-4",
        // typography
        "text-xs"
      )}
    >
      {/* 현재 단계 */}
      <span
        className={cn(
          // layout
          "px-2 py-1 rounded",
          // background
          "bg-zinc-100 dark:bg-zinc-800",
          // color
          phase === "complete"
            ? "text-zinc-700 dark:text-zinc-300"
            : "text-zinc-500 dark:text-zinc-400"
        )}
      >
        {phaseLabels[phase]}
      </span>

      {/* 복사 카운터 */}
      <span
        className={cn(
          // typography
          "font-mono",
          // color
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        복사: {copiedCount} / {totalCopyCost}
      </span>
    </div>
  );
}
