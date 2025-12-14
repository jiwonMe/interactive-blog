"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import type { Piece } from "./use-piece-table";

interface BufferDisplayProps {
  originalBuffer: string;
  addBuffer: string;
  selectedPiece: Piece | null;
}

/**
 * Original/Add 버퍼를 시각화하는 컴포넌트
 */
export function BufferDisplay({
  originalBuffer,
  addBuffer,
  selectedPiece,
}: BufferDisplayProps) {
  return (
    <div
      className={cn(
        // layout
        "space-y-4"
      )}
    >
      {/* Original Buffer */}
      <BufferSection
        label="original"
        buffer={originalBuffer}
        isOriginal={true}
        selectedPiece={selectedPiece}
      />

      {/* Add Buffer */}
      <BufferSection
        label="added"
        buffer={addBuffer}
        isOriginal={false}
        selectedPiece={selectedPiece}
      />
    </div>
  );
}

interface BufferSectionProps {
  label: string;
  buffer: string;
  isOriginal: boolean;
  selectedPiece: Piece | null;
}

/**
 * 개별 버퍼 섹션
 */
function BufferSection({
  label,
  buffer,
  isOriginal,
  selectedPiece,
}: BufferSectionProps) {
  // 선택된 piece가 이 버퍼를 참조하는지 확인
  const isReferencedBySelected =
    selectedPiece !== null &&
    ((isOriginal && selectedPiece.buffer === "original") ||
      (!isOriginal && selectedPiece.buffer === "add"));

  // 하이라이트 범위 계산
  const highlightStart = isReferencedBySelected ? selectedPiece!.offset : -1;
  const highlightEnd = isReferencedBySelected
    ? selectedPiece!.offset + selectedPiece!.length
    : -1;

  return (
    <div
      className={cn(
        // layout
        "rounded-lg overflow-hidden",
        // border
        "border",
        "border-zinc-200 dark:border-zinc-700"
      )}
    >
      {/* 라벨 */}
      <div
        className={cn(
          // layout
          "px-3 py-1.5",
          // background
          isOriginal
            ? "bg-zinc-100 dark:bg-zinc-800"
            : "bg-zinc-200 dark:bg-zinc-700",
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
        </span>
      </div>

      {/* 버퍼 내용 */}
      <div
        className={cn(
          // layout
          "px-3 py-2 min-h-[40px]",
          // background
          isOriginal
            ? "bg-zinc-50 dark:bg-zinc-900"
            : "bg-zinc-100 dark:bg-zinc-800"
        )}
      >
        {buffer.length === 0 ? (
          <span
            className={cn(
              // typography
              "text-sm italic",
              // color
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            (비어있음)
          </span>
        ) : (
          <BufferText
            text={buffer}
            highlightStart={highlightStart}
            highlightEnd={highlightEnd}
            isAdd={!isOriginal}
          />
        )}
      </div>
    </div>
  );
}

interface BufferTextProps {
  text: string;
  highlightStart: number;
  highlightEnd: number;
  isAdd: boolean;
}

/**
 * 버퍼 텍스트 렌더링 (하이라이트 포함)
 */
function BufferText({
  text,
  highlightStart,
  highlightEnd,
  isAdd,
}: BufferTextProps) {
  // 하이라이트가 없으면 일반 텍스트
  if (highlightStart < 0 || highlightEnd < 0) {
    return (
      <pre
        className={cn(
          // reset browser default margin
          "m-0",
          // typography
          "text-sm font-mono whitespace-pre-wrap break-all",
          // color
          "text-zinc-700 dark:text-zinc-300",
          //border
          "border-0"
        )}
      >
        {text}
      </pre>
    );
  }

  // 하이라이트 영역 분리
  const before = text.slice(0, highlightStart);
  const highlighted = text.slice(highlightStart, highlightEnd);
  const after = text.slice(highlightEnd);

  return (
    <pre
      className={cn(
        // reset browser default margin
        "m-0",
        // typography
        "text-sm font-mono whitespace-pre-wrap break-all",
        // color
        "text-zinc-700 dark:text-zinc-300",
        //border
        "border-0"
      )}
    >
      {before}
      <span
        className={cn(
          // background (add: 붉은색, original: 파란색)
          isAdd
            ? "bg-red-100 dark:bg-red-900/40"
            : "bg-blue-100 dark:bg-blue-900/40",
          // color (add: 붉은색, original: 파란색)
          isAdd
            ? "text-red-700 dark:text-red-300"
            : "text-blue-700 dark:text-blue-300",
          // border
          "rounded px-0.5"
        )}
      >
        {highlighted}
      </span>
      {after}
    </pre>
  );
}
