"use client";

import React, { useCallback, useRef } from "react";
import { cn } from "../../../lib/utils";
import { usePieceTable } from "./use-piece-table";
import { BufferDisplay } from "./BufferDisplay";
import { PieceList } from "./PieceList";
import { TextModel } from "./TextModel";

const INITIAL_TEXT = "Hello World";

/**
 * Piece Table 자료구조를 시각화하는 메인 컴포넌트
 */
export function PieceTableVisualizer() {
  const {
    originalBuffer,
    addBuffer,
    pieces,
    selectedPieceId,
    selectedPiece,
    selectedTextRange,
    text,
    lines,
    insert,
    remove,
    selectPiece,
    reset,
    getPieceText,
  } = usePieceTable(INITIAL_TEXT);

  // 이전 텍스트 길이를 추적하여 삽입/삭제 구분
  const prevTextRef = useRef(text);

  /**
   * 텍스트 변경 처리
   * 간단한 diff로 삽입/삭제 구분
   */
  const handleTextChange = useCallback(
    (newText: string, cursorPosition: number) => {
      const prevText = prevTextRef.current;
      const lenDiff = newText.length - prevText.length;

      if (lenDiff > 0) {
        // 삽입: 새로 추가된 텍스트 찾기
        const insertPos = cursorPosition - lenDiff;
        const insertedText = newText.slice(insertPos, cursorPosition);
        insert(insertPos, insertedText);
      } else if (lenDiff < 0) {
        // 삭제
        const deleteLen = -lenDiff;
        const deletePos = cursorPosition;
        remove(deletePos, deleteLen);
      }

      prevTextRef.current = newText;
    },
    [insert, remove]
  );

  /**
   * 초기화 핸들러
   */
  const handleReset = useCallback(() => {
    reset();
    prevTextRef.current = INITIAL_TEXT;
  }, [reset]);

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
          "flex items-center justify-between px-5 py-4",
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
          Piece Table 시각화
        </h3>
        <button
          onClick={handleReset}
          className={cn(
            // layout
            "px-3 py-1.5 rounded-lg",
            // typography
            "text-sm font-medium",
            // color
            "text-zinc-600 dark:text-zinc-400",
            // background
            "bg-zinc-200 dark:bg-zinc-800",
            // hover
            "hover:bg-zinc-300 dark:hover:bg-zinc-700",
            // transition
            "transition-colors"
          )}
        >
          초기화
        </button>
      </div>

      {/* 메인 영역: 2열 레이아웃 */}
      <div
        className={cn(
          // layout
          "grid grid-cols-1 lg:grid-cols-2 gap-4 p-4",
          // background
          "bg-white dark:bg-zinc-950"
        )}
      >
        {/* 왼쪽: Piece Table */}
        <div
          className={cn(
            // layout
            "space-y-4"
          )}
        >
          <SectionHeader title="Piece Table" />

          {/* 버퍼 표시 */}
          <BufferDisplay
            originalBuffer={originalBuffer}
            addBuffer={addBuffer}
            selectedPiece={selectedPiece}
          />

          {/* Piece 목록 */}
          <PieceList
            pieces={pieces}
            selectedPieceId={selectedPieceId}
            onSelectPiece={selectPiece}
            getPieceText={getPieceText}
          />
        </div>

        {/* 오른쪽: Text Model */}
        <div
          className={cn(
            // layout
            "flex flex-col min-h-[300px]"
          )}
        >
          <SectionHeader title="Text Model" />
          <div className="flex-1 mt-4">
            <TextModel
              text={text}
              lines={lines}
              highlightRange={selectedTextRange}
              onTextChange={handleTextChange}
            />
          </div>
        </div>
      </div>

      {/* 하단 설명 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-50 dark:bg-zinc-900",
          // border
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        <ExplanationCards />
      </div>
    </div>
  );
}

/**
 * 섹션 헤더
 */
function SectionHeader({ title }: { title: string }) {
  return (
    <h4
      className={cn(
        // typography
        "text-sm font-semibold",
        // color
        "text-zinc-700 dark:text-zinc-300"
      )}
    >
      {title}
    </h4>
  );
}

/**
 * 하단 설명 카드들
 */
function ExplanationCards() {
  const explanations = [
    {
      title: "원본 불변",
      description: "Original buffer는 절대 수정되지 않습니다.",
    },
    {
      title: "Append Only",
      description: "새 텍스트는 Add buffer 끝에만 추가됩니다.",
    },
    {
      title: "조각 참조",
      description: "Piece가 버퍼의 일부를 참조하여 텍스트를 구성합니다.",
    },
  ];

  return (
    <div
      className={cn(
        // layout
        "grid grid-cols-1 md:grid-cols-3 gap-3"
      )}
    >
      {explanations.map((item) => (
        <div
          key={item.title}
          className={cn(
            // layout
            "p-3 rounded-lg",
            // background
            "bg-white dark:bg-zinc-800"
          )}
        >
          <span
            className={cn(
              // typography
              "text-sm font-semibold",
              // color
              "text-zinc-800 dark:text-zinc-200"
            )}
          >
            {item.title}
          </span>
          <p
            className={cn(
              // typography
              "text-xs mt-1",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
