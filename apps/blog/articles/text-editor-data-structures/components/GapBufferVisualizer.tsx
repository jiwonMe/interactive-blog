"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { useGapBuffer } from "./use-gap-buffer";

/**
 * Gap Buffer 시각화 메인 컴포넌트
 */
export function GapBufferVisualizer() {
  const {
    buffer,
    gapStart,
    gapEnd,
    gapSize,
    text,
    cursorPosition,
    animation,
    isAnimating,
    lastOperation,
    moveCursor,
    insert,
    deleteChar,
    reset,
  } = useGapBuffer("Hello");

  const [inputChar, setInputChar] = useState("X");

  const handleInsert = () => {
    if (inputChar.length > 0) {
      insert(inputChar[0]);
    }
  };

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
          Gap Buffer 시각화
        </h3>
        <p
          className={cn(
            // typography
            "text-sm mt-1",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          커서 위치에 gap을 두어 삽입/삭제를 O(1)로 처리
        </p>
      </div>

      {/* 메인 영역 */}
      <div
        className={cn(
          // layout
          "p-5 space-y-4",
          // background
          "bg-white dark:bg-zinc-950"
        )}
      >
        {/* 버퍼 시각화 */}
        <BufferVisualization
          buffer={buffer}
          gapStart={gapStart}
          gapEnd={gapEnd}
          cursorPosition={cursorPosition}
          onCellClick={(index) => {
            // 클릭한 위치로 커서 이동
            const logicalPos =
              index < gapStart ? index : index - (gapEnd - gapStart);
            moveCursor(Math.max(0, Math.min(logicalPos, text.length)));
          }}
          isAnimating={isAnimating}
          animationPhase={animation.phase}
        />

        {/* 결과 텍스트 */}
        <ResultText text={text} cursorPosition={cursorPosition} />

        {/* 컨트롤 패널 */}
        <ControlPanel
          inputChar={inputChar}
          setInputChar={setInputChar}
          onInsert={handleInsert}
          onDelete={deleteChar}
          onMoveLeft={() => moveCursor(cursorPosition - 1)}
          onMoveRight={() => moveCursor(cursorPosition + 1)}
          onReset={reset}
          isAnimating={isAnimating}
          gapSize={gapSize}
          canDelete={cursorPosition > 0}
        />

        {/* 정보 패널 */}
        <InfoPanel
          gapStart={gapStart}
          gapEnd={gapEnd}
          gapSize={gapSize}
          textLength={text.length}
          lastOperation={lastOperation}
        />
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
        <ExplanationSection />
      </div>
    </div>
  );
}

/**
 * 버퍼 시각화 컴포넌트
 */
function BufferVisualization({
  buffer,
  gapStart,
  gapEnd,
  cursorPosition,
  onCellClick,
  isAnimating,
  animationPhase,
}: {
  buffer: (string | null)[];
  gapStart: number;
  gapEnd: number;
  cursorPosition: number;
  onCellClick: (index: number) => void;
  isAnimating: boolean;
  animationPhase: string;
}) {
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
          Buffer 배열
          <span className="ml-2 text-zinc-400">
            (클릭하여 커서 이동)
          </span>
        </span>
      </div>

      {/* 셀 배열 */}
      <div
        className={cn(
          // layout
          "p-3",
          // background
          "bg-white dark:bg-zinc-900"
        )}
      >
        <div className="flex flex-wrap gap-1">
          {buffer.map((char, index) => {
            const isGap = index >= gapStart && index < gapEnd;
            const isCursor = index === gapStart;
            const isMoving =
              animationPhase === "moving-gap" &&
              (index === gapStart || index === gapEnd - 1);

            return (
              <button
                key={index}
                onClick={() => !isAnimating && onCellClick(index)}
                disabled={isAnimating}
                className={cn(
                  // layout
                  "w-8 h-8 rounded",
                  // flex
                  "flex items-center justify-center",
                  // typography
                  "text-xs font-mono",
                  // transition
                  "transition-all duration-200",
                  // 커서 위치
                  isCursor && "ring-2 ring-blue-400",
                  // gap 영역
                  isGap
                    ? cn(
                        "bg-zinc-100 dark:bg-zinc-800",
                        "border border-dashed border-zinc-300 dark:border-zinc-600",
                        "text-zinc-400"
                      )
                    : cn(
                        "bg-white dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-700",
                        "text-zinc-700 dark:text-zinc-300"
                      ),
                  // 이동 중
                  isMoving &&
                    cn(
                      "bg-amber-100 dark:bg-amber-900/30",
                      "border-amber-300 dark:border-amber-700"
                    ),
                  // hover
                  !isAnimating &&
                    "hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer",
                  isAnimating && "cursor-not-allowed"
                )}
              >
                {isGap ? "·" : char}
              </button>
            );
          })}
        </div>

        {/* 인덱스 표시 */}
        <div className="flex flex-wrap gap-1 mt-1">
          {buffer.map((_, index) => (
            <div
              key={index}
              className={cn(
                // layout
                "w-8 h-4",
                // flex
                "flex items-center justify-center",
                // typography
                "text-[10px] font-mono",
                // color
                "text-zinc-400"
              )}
            >
              {index}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 결과 텍스트 표시
 */
function ResultText({
  text,
  cursorPosition,
}: {
  text: string;
  cursorPosition: number;
}) {
  return (
    <div
      className={cn(
        // layout
        "px-4 py-3 rounded-lg",
        // background
        "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      <div
        className={cn(
          // typography
          "text-xs font-medium mb-2",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        결과 텍스트
      </div>
      <div
        className={cn(
          // typography
          "text-lg font-mono",
          // color
          "text-zinc-700 dark:text-zinc-300"
        )}
      >
        {text.slice(0, cursorPosition)}
        <span
          className={cn(
            // layout
            "inline-block w-0.5 h-5 mx-0.5",
            // background
            "bg-blue-500",
            // animation
            "animate-pulse"
          )}
        />
        {text.slice(cursorPosition)}
        {text.length === 0 && (
          <span className="text-zinc-400">(비어있음)</span>
        )}
      </div>
    </div>
  );
}

/**
 * 컨트롤 패널
 */
function ControlPanel({
  inputChar,
  setInputChar,
  onInsert,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onReset,
  isAnimating,
  gapSize,
  canDelete,
}: {
  inputChar: string;
  setInputChar: (v: string) => void;
  onInsert: () => void;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onReset: () => void;
  isAnimating: boolean;
  gapSize: number;
  canDelete: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* 삽입 영역 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputChar}
          onChange={(e) => setInputChar(e.target.value.slice(0, 1))}
          maxLength={1}
          disabled={isAnimating}
          className={cn(
            // layout
            "w-12 px-3 py-1.5 rounded-md text-center",
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
            "disabled:opacity-50"
          )}
        />

        <button
          onClick={onInsert}
          disabled={isAnimating || gapSize === 0 || inputChar.length === 0}
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
          삽입
        </button>

        <button
          onClick={onDelete}
          disabled={isAnimating || !canDelete}
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
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          삭제
        </button>
      </div>

      {/* 커서 이동 버튼 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMoveLeft}
          disabled={isAnimating}
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
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          ← 커서 이동
        </button>

        <button
          onClick={onMoveRight}
          disabled={isAnimating}
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
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          커서 이동 →
        </button>

        <div className="flex-1" />

        <button
          onClick={onReset}
          disabled={isAnimating}
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
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          초기화
        </button>
      </div>
    </div>
  );
}

/**
 * 정보 패널
 */
function InfoPanel({
  gapStart,
  gapEnd,
  gapSize,
  textLength,
  lastOperation,
}: {
  gapStart: number;
  gapEnd: number;
  gapSize: number;
  textLength: number;
  lastOperation: string | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <InfoCard label="Gap 시작" value={String(gapStart)} />
      <InfoCard label="Gap 끝" value={String(gapEnd)} />
      <InfoCard label="Gap 크기" value={String(gapSize)} />
      <InfoCard label="텍스트 길이" value={String(textLength)} />
      {lastOperation && (
        <div className="col-span-2 md:col-span-4">
          <InfoCard label="마지막 연산" value={lastOperation} isText />
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  isText = false,
}: {
  label: string;
  value: string;
  isText?: boolean;
}) {
  return (
    <div
      className={cn(
        // layout
        "px-3 py-2 rounded-lg",
        // background
        "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      <div
        className={cn(
          // typography
          "text-xs",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          // typography
          isText ? "text-xs" : "text-lg font-bold font-mono",
          // color
          "text-zinc-700 dark:text-zinc-300",
          // truncate
          isText && "truncate"
        )}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * 설명 섹션
 */
function ExplanationSection() {
  const items = [
    { label: "삽입 O(1)", desc: "gap에 직접 추가" },
    { label: "삭제 O(1)", desc: "gap 확장" },
    { label: "이동 O(k)", desc: "k칸 이동 시 k번 복사" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            // layout
            "p-2 rounded-lg",
            // background
            "bg-white dark:bg-zinc-800"
          )}
        >
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
          <p
            className={cn(
              // typography
              "text-xs mt-0.5",
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
