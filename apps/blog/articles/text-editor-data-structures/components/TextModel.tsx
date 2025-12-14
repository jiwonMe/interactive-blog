"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "../../../lib/utils";

interface TextModelProps {
  text: string;
  lines: string[];
  onTextChange: (newText: string, cursorPosition: number) => void;
}

/**
 * 결과 텍스트를 줄 번호와 함께 표시하는 컴포넌트
 * 편집 가능한 영역 포함
 */
export function TextModel({ text, lines, onTextChange }: TextModelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 변경 핸들러
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const cursorPosition = e.target.selectionStart;
      onTextChange(newText, cursorPosition);
    },
    [onTextChange]
  );

  return (
    <div
      className={cn(
        // layout
        "h-full flex flex-col",
        // border
        "rounded-lg overflow-hidden border",
        "border-zinc-200 dark:border-zinc-700"
      )}
    >
      {/* 헤더 */}
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
          Text Model
        </span>
      </div>

      {/* 본문 영역 */}
      <div
        className={cn(
          // layout
          "flex-1 flex",
          // background
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        {/* 줄 번호 */}
        <div
          className={cn(
            // layout
            "py-3 px-2 select-none",
            // background
            "bg-zinc-100 dark:bg-zinc-800",
            // border
            "border-r border-zinc-200 dark:border-zinc-700"
          )}
        >
          {lines.map((_, index) => (
            <div
              key={index}
              className={cn(
                // typography
                "text-xs font-mono leading-6 text-right",
                // color
                "text-zinc-400 dark:text-zinc-500"
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* 텍스트 영역 */}
        <div
          className={cn(
            // layout
            "flex-1 relative"
          )}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            spellCheck={false}
            className={cn(
              // layout
              "w-full h-full py-3 px-3 resize-none",
              // typography
              "text-sm font-mono leading-6",
              // background
              "bg-transparent",
              // color
              "text-zinc-700 dark:text-zinc-300",
              // focus
              "outline-none",
              // placeholder
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            )}
            placeholder="텍스트를 입력하세요..."
          />
        </div>
      </div>

      {/* 상태 바 */}
      <div
        className={cn(
          // layout
          "px-3 py-1.5 flex items-center justify-between",
          // background
          "bg-zinc-100 dark:bg-zinc-800",
          // border
          "border-t border-zinc-200 dark:border-zinc-700"
        )}
      >
        <span
          className={cn(
            // typography
            "text-xs",
            // color
            "text-zinc-400 dark:text-zinc-500"
          )}
        >
          {lines.length} lines, {text.length} chars
        </span>
      </div>
    </div>
  );
}
