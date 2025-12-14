"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import type { AnimationPhase } from "./use-string-insert";

interface CellArrayProps {
  label: string;
  array: string[];
  highlightIndex?: number;
  insertPosition?: number;
  insertLength?: number;
  phase?: AnimationPhase;
  maxDisplay?: number;
  onCellClick?: (index: number) => void;
  clickable?: boolean;
  selectedPosition?: number;
}

/**
 * 문자열 배열을 셀 단위로 시각화하는 컴포넌트
 */
export function CellArray({
  label,
  array,
  highlightIndex = -1,
  insertPosition = -1,
  insertLength = 0,
  phase = "idle",
  maxDisplay = 50,
  onCellClick,
  clickable = false,
  selectedPosition = -1,
}: CellArrayProps) {
  // 너무 긴 배열은 축약 표시
  const shouldTruncate = array.length > maxDisplay;
  const displayArray = shouldTruncate
    ? [...array.slice(0, maxDisplay / 2), "...", ...array.slice(-maxDisplay / 2)]
    : array;

  return (
    <div
      className={cn(
        // layout
        "rounded-lg overflow-hidden",
        // border
        "border border-zinc-200 dark:border-zinc-700"
      )}
    >
      {/* 라벨 */}
      <div
        className={cn(
          // layout
          "px-3 py-1.5",
          // background
          "bg-zinc-100 dark:bg-zinc-800",
          // border
          "border-b border-zinc-200 dark:border-zinc-700"
        )}
      >
        <span
          className={cn(
            // typography
            "text-xs font-medium",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          {label}
          {shouldTruncate && (
            <span className="ml-2 text-zinc-400">
              ({array.length}개 중 {maxDisplay}개 표시)
            </span>
          )}
          {clickable && (
            <span className="ml-2 text-zinc-400 dark:text-zinc-500">
              (클릭하여 삽입 위치 선택)
            </span>
          )}
        </span>
      </div>

      {/* 셀 배열 */}
      <div
        className={cn(
          // layout
          "p-3 overflow-x-auto",
          // background
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        <div
          className={cn(
            // layout
            "flex flex-wrap gap-1"
          )}
        >
          {displayArray.map((char, index) => {
            const isHighlighted = index === highlightIndex;
            const isInserted =
              insertPosition >= 0 &&
              index >= insertPosition &&
              index < insertPosition + insertLength;
            const isEmpty = char === "";
            const isEllipsis = char === "...";
            const isSelected = index === selectedPosition;

            return (
              <Cell
                key={index}
                char={char}
                index={index}
                isHighlighted={isHighlighted}
                isInserted={isInserted}
                isEmpty={isEmpty}
                isEllipsis={isEllipsis}
                isSelected={isSelected}
                phase={phase}
                onClick={clickable && onCellClick ? () => onCellClick(index) : undefined}
                clickable={clickable}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CellProps {
  char: string;
  index: number;
  isHighlighted: boolean;
  isInserted: boolean;
  isEmpty: boolean;
  isEllipsis: boolean;
  isSelected: boolean;
  phase: AnimationPhase;
  onClick?: () => void;
  clickable: boolean;
}

/**
 * 개별 셀 컴포넌트
 */
function Cell({
  char,
  isHighlighted,
  isInserted,
  isEmpty,
  isEllipsis,
  isSelected,
  onClick,
  clickable,
}: CellProps) {
  if (isEllipsis) {
    return (
      <div
        className={cn(
          // layout
          "flex items-center justify-center px-2",
          // typography
          "text-xs font-mono",
          // color
          "text-zinc-400 dark:text-zinc-500"
        )}
      >
        ...
      </div>
    );
  }

  const Component = clickable ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        // layout
        "w-6 h-7 flex items-center justify-center",
        // typography
        "text-xs font-mono font-medium",
        // border
        "border rounded",
        // transition
        "transition-all duration-150",
        // 클릭 가능 스타일
        clickable && "cursor-pointer hover:scale-105",
        // 상태별 스타일 (흑백 기반, 삽입/커서만 강조)
        isEmpty
          ? cn(
              // 빈 셀
              "border-dashed",
              "border-zinc-300 dark:border-zinc-700",
              "bg-zinc-50 dark:bg-zinc-900"
            )
          : isHighlighted
            ? cn(
                // 현재 복사/삽입 중인 커서 (강조 색상)
                "border-blue-400 dark:border-blue-500",
                "bg-blue-100 dark:bg-blue-900/50",
                "text-blue-700 dark:text-blue-300",
                "ring-2 ring-blue-400/50",
                "scale-110"
              )
            : isInserted
              ? cn(
                  // 새로 삽입된 텍스트 (옅은 강조 색상)
                  "border-emerald-300 dark:border-emerald-700",
                  "bg-emerald-50 dark:bg-emerald-950/50",
                  "text-emerald-700 dark:text-emerald-300",
                  "font-bold"
                )
              : isSelected
                ? cn(
                    // 선택된 삽입 위치 (강조 색상)
                    "border-blue-400 dark:border-blue-500",
                    "bg-blue-50 dark:bg-blue-900/30",
                    "text-blue-600 dark:text-blue-400",
                    "ring-1 ring-blue-300/50"
                  )
                : cn(
                    // 일반 셀
                    "border-zinc-200 dark:border-zinc-700",
                    "bg-white dark:bg-zinc-900",
                    "text-zinc-600 dark:text-zinc-400",
                    clickable && "hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )
      )}
    >
      {char}
    </Component>
  );
}
