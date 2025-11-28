"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../../lib/utils";

/**
 * 조합 단계 타입
 */
interface CompositionStep {
  id: number;
  input: string;
  display: string;
  isComposing: boolean;
  description: string;
}

/**
 * 한글 조합 과정을 시각적으로 보여주는 컴포넌트
 */
export function HangulCompositionFlow() {
  const [steps, setSteps] = useState<CompositionStep[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentComposition, setCurrentComposition] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const stepIdRef = useRef(0);

  // 단계 추가
  const addStep = useCallback((step: Omit<CompositionStep, "id">) => {
    const newStep: CompositionStep = {
      id: ++stepIdRef.current,
      ...step,
    };
    setSteps((prev) => [...prev.slice(-10), newStep]);
  }, []);

  // 이벤트 핸들러들
  const handleCompositionStart = () => {
    setIsComposing(true);
    setCurrentComposition("");
  };

  const handleCompositionUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
    setCurrentComposition(e.data);
    addStep({
      input: e.data,
      display: e.data,
      isComposing: true,
      description: `조합 중: "${e.data}" (미확정 상태, 밑줄 표시)`,
    });
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    setCurrentComposition("");
    if (e.data) {
      addStep({
        input: e.data,
        display: e.data,
        isComposing: false,
        description: `조합 완료: "${e.data}" → 확정됨`,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    setSteps([]);
    setInputValue("");
    setCurrentComposition("");
    setIsComposing(false);
    stepIdRef.current = 0;
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
          한글 조합 시각화
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

      {/* 메인 영역 */}
      <div
        className={cn(
          // layout
          "p-6",
          // background
          "bg-white dark:bg-zinc-950"
        )}
      >
        {/* 현재 조합 상태 표시 */}
        <CompositionDisplay
          value={inputValue}
          currentComposition={currentComposition}
          isComposing={isComposing}
        />

        {/* 입력창 */}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          placeholder='한글을 입력해보세요 (예: "가나다")'
          className={cn(
            // layout
            "w-full mt-6 px-4 py-3 rounded-xl",
            // typography
            "text-base",
            // background
            "bg-zinc-50 dark:bg-zinc-900",
            // border
            "border-2",
            isComposing
              ? "border-amber-400 dark:border-amber-600"
              : "border-zinc-300 dark:border-zinc-700",
            // color
            "text-zinc-900 dark:text-zinc-100",
            // placeholder
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
            // focus
            "outline-none focus:border-blue-400 dark:focus:border-blue-600",
            // transition
            "transition-colors"
          )}
        />
      </div>

      {/* 조합 단계 타임라인 */}
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
        <h4
          className={cn(
            // typography
            "text-sm font-medium mb-3",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          조합 과정
        </h4>

        {steps.length === 0 ? (
          <p
            className={cn(
              // typography
              "text-sm",
              // color
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            한글을 입력하면 조합 과정이 여기에 표시됩니다.
          </p>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepItem key={step.id} step={step} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* 설명 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-100 dark:bg-zinc-800",
          // border
          "border-t border-zinc-200 dark:border-zinc-700"
        )}
      >
        <ExplanationCards />
      </div>
    </div>
  );
}

/**
 * 현재 조합 상태를 크게 보여주는 컴포넌트
 */
function CompositionDisplay({
  value,
  currentComposition,
  isComposing,
}: {
  value: string;
  currentComposition: string;
  isComposing: boolean;
}) {
  // 확정된 텍스트와 조합 중인 텍스트 분리
  const confirmedText = isComposing
    ? value.slice(0, -currentComposition.length || undefined)
    : value;

  return (
    <div
      className={cn(
        // layout
        "min-h-24 rounded-xl p-6 flex items-center justify-center",
        // background
        "bg-gradient-to-br from-zinc-100 to-zinc-50",
        "dark:from-zinc-800 dark:to-zinc-900"
      )}
    >
      <div
        className={cn(
          // typography
          "text-4xl font-bold tracking-wide",
          // color
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        {confirmedText.length === 0 && !isComposing ? (
          <span className="text-zinc-300 dark:text-zinc-600">_</span>
        ) : (
          <>
            {/* 확정된 텍스트 */}
            <span>{confirmedText}</span>
            {/* 조합 중인 텍스트 */}
            {isComposing && currentComposition && (
              <span
                className={cn(
                  // border bottom for composing state
                  "border-b-4 border-amber-400 dark:border-amber-500",
                  // color
                  "text-amber-600 dark:text-amber-400"
                )}
              >
                {currentComposition}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 조합 단계 아이템
 */
function StepItem({ step, index }: { step: CompositionStep; index: number }) {
  return (
    <div
      className={cn(
        // layout
        "flex items-start gap-3 p-3 rounded-lg",
        // background
        step.isComposing
          ? "bg-amber-50 dark:bg-amber-950/30"
          : "bg-emerald-50 dark:bg-emerald-950/30"
      )}
    >
      {/* 번호 */}
      <span
        className={cn(
          // layout
          "shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
          // typography
          "text-xs font-bold",
          // background & color
          step.isComposing
            ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
            : "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200"
        )}
      >
        {index + 1}
      </span>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* 표시 글자 */}
          <span
            className={cn(
              // typography
              "text-xl font-bold",
              // color
              step.isComposing
                ? "text-amber-700 dark:text-amber-300"
                : "text-emerald-700 dark:text-emerald-300"
            )}
          >
            {step.display}
          </span>
          {/* 상태 배지 */}
          <span
            className={cn(
              // layout
              "px-2 py-0.5 rounded-full",
              // typography
              "text-xs font-medium",
              // background & color
              step.isComposing
                ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                : "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
            )}
          >
            {step.isComposing ? "조합 중" : "확정"}
          </span>
        </div>
        {/* 설명 */}
        <p
          className={cn(
            // typography
            "text-sm mt-1",
            // color
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

/**
 * 설명 카드들
 */
function ExplanationCards() {
  const explanations = [
    {
      icon: "🔤",
      title: "영어 입력",
      description: "키 하나 = 문자 하나. 즉시 확정.",
    },
    {
      icon: "🇰🇷",
      title: "한글 입력",
      description: "여러 키 → 하나의 글자. IME가 조합.",
    },
    {
      icon: "⚠️",
      title: "버그 원인",
      description: "조합 중 value 변경 → 조합 취소됨.",
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
            "bg-white dark:bg-zinc-900"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{item.icon}</span>
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
          </div>
          <p
            className={cn(
              // typography
              "text-xs",
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

