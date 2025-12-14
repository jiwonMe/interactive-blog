"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { useStringInsert } from "./use-string-insert";
import { CellArray } from "./CellArray";
import { InsertControlPanel } from "./InsertControlPanel";

/**
 * 일반 문자열 삽입 시각화 컴포넌트
 * 중간 삽입이 O(n)인 이유를 직관적으로 보여줌
 */
export function StringInsertVisualizer() {
  const {
    originalText,
    setOriginalText,
    insertText,
    setInsertText,
    insertPosition,
    selectInsertPosition,
    originalArray,
    stringLength,
    animationState,
    runAnimation,
    reset,
  } = useStringInsert();

  const { phase, copiedCount, currentIndex, newArray } = animationState;
  const showNewArray = phase !== "idle";
  const isRunning = phase !== "idle" && phase !== "complete";

  return (
    <div
      className={cn(
        // layout
        "w-full rounded-2xl overflow-hidden",
        // border
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* 헤더 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-100 dark:bg-zinc-900",
          // border
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <h3
          className={cn(
            // typography
            "text-lg font-semibold",
            // color
            "text-zinc-900 dark:text-zinc-100"
          )}
        >
          일반 문자열 삽입 시각화
        </h3>
        <p
          className={cn(
            // typography
            "text-sm mt-1",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          중간 삽입이 왜 O(n)인지 확인해보세요
        </p>
      </div>

      {/* 컨트롤 패널 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-white dark:bg-zinc-950",
          // border
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <InsertControlPanel
          originalText={originalText}
          setOriginalText={setOriginalText}
          insertText={insertText}
          setInsertText={setInsertText}
          insertPosition={insertPosition}
          onRun={runAnimation}
          onReset={reset}
          phase={phase}
          copiedCount={copiedCount}
          stringLength={stringLength}
        />
      </div>

      {/* 시각화 영역 */}
      <div
        className={cn(
          // layout
          "p-5 space-y-4",
          // background
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        {/* 원본 배열 (클릭으로 삽입 위치 선택) */}
        <CellArray
          label={`원본 문자열 (길이: ${stringLength})`}
          array={originalArray}
          highlightIndex={
            phase === "copy-before" || phase === "copy-after"
              ? phase === "copy-before"
                ? currentIndex
                : currentIndex - insertText.length
              : -1
          }
          phase={phase}
          clickable={!isRunning}
          onCellClick={selectInsertPosition}
          selectedPosition={phase === "idle" ? insertPosition : -1}
        />

        {/* 삽입 미리보기 (대기 상태에서만) */}
        {phase === "idle" && (
          <InsertPreview
            originalArray={originalArray}
            insertText={insertText}
            insertPosition={insertPosition}
          />
        )}

        {/* 새 배열 (애니메이션 중에만 표시) */}
        {showNewArray && (
          <CellArray
            label={`새 배열 (길이: ${newArray.length})`}
            array={newArray}
            highlightIndex={currentIndex}
            insertPosition={insertPosition}
            insertLength={insertText.length}
            phase={phase}
          />
        )}

        {/* 복사 비용 설명 */}
        {phase === "complete" && (
          <CopyCostExplanation
            stringLength={stringLength}
            copiedCount={copiedCount}
          />
        )}
      </div>

      {/* 하단 설명 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-100 dark:bg-zinc-900",
          // border
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        <ExplanationSection />
      </div>
    </div>
  );
}

/**
 * 삽입 미리보기
 */
function InsertPreview({
  originalArray,
  insertText,
  insertPosition,
}: {
  originalArray: string[];
  insertText: string;
  insertPosition: number;
}) {
  const before = originalArray.slice(0, insertPosition).join("");
  const after = originalArray.slice(insertPosition).join("");

  return (
    <div
      className={cn(
        // layout
        "flex items-center gap-1 px-3 py-2 rounded-lg flex-wrap",
        // background
        "bg-zinc-100 dark:bg-zinc-800",
        // border
        "border border-zinc-200 dark:border-zinc-700"
      )}
    >
      <span
        className={cn(
          // typography
          "text-xs",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        결과 미리보기:
      </span>
      <span
        className={cn(
          // typography
          "font-mono text-sm",
          // color
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        {before}
      </span>
      <span
        className={cn(
          // typography
          "font-mono text-sm font-bold",
          // color (삽입 텍스트 강조)
          "text-blue-600 dark:text-blue-400"
        )}
      >
        {insertText}
      </span>
      <span
        className={cn(
          // typography
          "font-mono text-sm",
          // color
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        {after}
      </span>
    </div>
  );
}

/**
 * 복사 비용 설명
 */
function CopyCostExplanation({
  stringLength,
  copiedCount,
}: {
  stringLength: number;
  copiedCount: number;
}) {
  return (
    <div
      className={cn(
        // layout
        "flex items-center gap-4 px-3 py-2 rounded-lg flex-wrap",
        // background
        "bg-zinc-100 dark:bg-zinc-800",
        // border
        "border border-zinc-200 dark:border-zinc-700"
      )}
    >
      <span
        className={cn(
          // typography
          "text-sm",
          // color
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        총 <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{copiedCount}</span>개의 문자를
        복사했습니다 (문자열 길이: {stringLength})
      </span>
      <span
        className={cn(
          // layout
          "px-2 py-0.5 rounded",
          // background
          "bg-zinc-200 dark:bg-zinc-700",
          // typography
          "text-xs font-mono font-bold",
          // color
          "text-zinc-700 dark:text-zinc-300"
        )}
      >
        O(n)
      </span>
    </div>
  );
}

/**
 * 하단 설명 섹션
 */
function ExplanationSection() {
  const steps = [
    { step: "1", label: "새 배열 할당", desc: "원본 + 삽입 텍스트 크기" },
    { step: "2", label: "앞부분 복사", desc: "0 ~ 삽입위치" },
    { step: "3", label: "텍스트 삽입", desc: "새 텍스트 배치" },
    { step: "4", label: "뒷부분 복사", desc: "삽입위치 ~ 끝" },
  ];

  return (
    <div
      className={cn(
        // layout
        "grid grid-cols-2 md:grid-cols-4 gap-2"
      )}
    >
      {steps.map((item) => (
        <div
          key={item.step}
          className={cn(
            // layout
            "p-2 rounded-lg",
            // background
            "bg-white dark:bg-zinc-800"
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                // layout
                "w-5 h-5 flex items-center justify-center rounded-full",
                // background
                "bg-zinc-200 dark:bg-zinc-700",
                // typography
                "text-xs font-bold",
                // color
                "text-zinc-600 dark:text-zinc-300"
              )}
            >
              {item.step}
            </span>
            <span
              className={cn(
                // typography
                "text-xs font-semibold",
                // color
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              {item.label}
            </span>
          </div>
          <p
            className={cn(
              // typography
              "text-xs mt-1 pl-7",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
