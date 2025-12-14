"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import type { Piece } from "./use-piece-table";

interface PieceListProps {
  pieces: Piece[];
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
  getPieceText: (piece: Piece) => string;
}

/**
 * Piece 목록을 카드 형태로 표시하는 컴포넌트
 */
export function PieceList({
  pieces,
  selectedPieceId,
  onSelectPiece,
  getPieceText,
}: PieceListProps) {
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
          nodes
        </span>
      </div>

      {/* Piece 목록 */}
      <div
        className={cn(
          // layout
          "p-2 space-y-1",
          // background
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        {pieces.length === 0 ? (
          <div
            className={cn(
              // layout
              "p-2",
              // typography
              "text-sm italic",
              // color
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            (조각 없음)
          </div>
        ) : (
          pieces.map((piece, index) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              index={index}
              isSelected={piece.id === selectedPieceId}
              onClick={() =>
                onSelectPiece(piece.id === selectedPieceId ? null : piece.id)
              }
              text={getPieceText(piece)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface PieceCardProps {
  piece: Piece;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  text: string;
}

/**
 * 개별 Piece 카드
 */
function PieceCard({
  piece,
  index,
  isSelected,
  onClick,
  text,
}: PieceCardProps) {
  // 텍스트 미리보기 (너무 길면 자르기)
  const previewText = text.length > 20 ? text.slice(0, 20) + "..." : text;
  // 줄바꿈을 시각적으로 표시
  const displayText = previewText.replace(/\n/g, "↵");

  // add 버퍼는 붉은색, original 버퍼는 파란색
  const isAdd = piece.buffer === "add";

  return (
    <button
      onClick={onClick}
      className={cn(
        // layout
        "w-full p-2 rounded-md",
        // typography
        "text-left text-sm",
        // background
        "bg-zinc-100 dark:bg-zinc-800",
        // border
        "border-2",
        isSelected
          ? isAdd
            ? "border-red-500 dark:border-red-400"
            : "border-blue-500 dark:border-blue-400"
          : "border-transparent",
        // hover
        "hover:bg-zinc-200 dark:hover:bg-zinc-700",
        // transition
        "transition-colors",
        // cursor
        "cursor-pointer"
      )}
    >
      <div
        className={cn(
          // layout
          "flex items-center gap-2"
        )}
      >
        {/* 타입 배지 */}
        <span
          className={cn(
            // layout
            "shrink-0 px-1.5 py-0.5 rounded",
            // typography
            "text-xs font-mono font-medium",
            // background & color (add: 붉은색, original: 파란색)
            isAdd
              ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
          )}
        >
          {isAdd ? "add" : "orig"}
        </span>

        {/* 메타데이터 */}
        <span
          className={cn(
            // typography
            "font-mono text-xs",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          offset: {piece.offset}, len: {piece.length}
        </span>
      </div>

      {/* 텍스트 미리보기 */}
      <div
        className={cn(
          // layout
          "mt-1 pl-1",
          // typography
          "font-mono text-xs truncate",
          // color (add: 붉은색, original: 파란색)
          isSelected
            ? isAdd
              ? "text-red-600 dark:text-red-400"
              : "text-blue-600 dark:text-blue-400"
            : "text-zinc-600 dark:text-zinc-400"
        )}
      >
        "{displayText}"
      </div>
    </button>
  );
}
