"use client";

import React, { useState, useRef } from "react";
import { cn } from "../../../lib/utils";

/**
 * 버그가 발생하는 입력창과 정상적인 입력창을 비교하는 데모 컴포넌트
 */
export function BuggyInputDemo() {
  // 버그 발생 입력창 상태 (표시용)
  const [buggyValue, setBuggyValue] = useState("");
  // 정상 입력창 상태
  const [fixedValue, setFixedValue] = useState("");
  // 조합 중인지 여부
  const isComposing = useRef(false);
  // 버그 입력창 ref (DOM 직접 조작용)
  const buggyInputRef = useRef<HTMLInputElement>(null);

  // 버그 발생: DOM을 직접 조작하여 IME 조합을 깨뜨림
  const handleBuggyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    
    // 핵심: DOM의 value를 "다른 값으로" 설정하면 IME 조합이 깨짐
    // 같은 값을 넣으면 브라우저가 최적화로 건너뛸 수 있음
    // 임시로 다른 값을 넣었다가 원래 값으로 복원하는 트릭
    input.value = newValue + "\u200B"; // Zero-width space 추가
    input.value = newValue; // 다시 원래 값으로
    
    setBuggyValue(newValue);
  };

  // 정상 동작: 조합 중에는 값을 그대로 유지
  const handleFixedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const composing = (e.nativeEvent as InputEvent)?.isComposing ?? isComposing.current;

    if (composing) {
      setFixedValue(newValue);
    } else {
      setFixedValue(newValue.trim());
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    setFixedValue(e.currentTarget.value.trim());
  };

  const handleReset = () => {
    setBuggyValue("");
    setFixedValue("");
    if (buggyInputRef.current) {
      buggyInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        // layout
        "w-full rounded-2xl p-6",
        // background
        "bg-zinc-50 dark:bg-zinc-900",
        // border
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* 헤더 */}
      <div
        className={cn(
          // layout
          "flex items-center justify-between mb-6"
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
          한글 입력 테스트
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

      {/* 입력창 비교 */}
      <div
        className={cn(
          // layout
          "grid grid-cols-1 md:grid-cols-2 gap-6"
        )}
      >
        {/* 버그 발생 입력창 */}
        <InputCard
          title="🐛 버그 발생"
          description="onChange에서 input.value를 직접 설정"
          value={buggyValue}
          onChange={handleBuggyChange}
          inputRef={buggyInputRef}
          uncontrolled
          status="error"
          code="input.value = newValue (DOM 직접 조작)"
        />

        {/* 정상 입력창 */}
        <InputCard
          title="✅ 정상 동작"
          description="조합 중에는 값을 그대로 유지"
          value={fixedValue}
          onChange={handleFixedChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          status="success"
          code="compositionEnd에서만 trim()"
        />
      </div>

      {/* 안내 메시지 */}
      <p
        className={cn(
          // layout
          "mt-6 text-center",
          // typography
          "text-sm",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        💡 &quot;가나다&quot;를 입력해보세요. 왼쪽은 &quot;ㄱㅏㄴㅏㄷㅏ&quot;로 풀어지고, 오른쪽은 정상 동작합니다.
      </p>
    </div>
  );
}

/**
 * 입력 카드 컴포넌트
 */
interface InputCardProps {
  title: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: (e: React.CompositionEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  uncontrolled?: boolean;
  status: "error" | "success";
  code: string;
}

function InputCard({
  title,
  description,
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  inputRef,
  uncontrolled = false,
  status,
  code,
}: InputCardProps) {
  const isError = status === "error";

  return (
    <div
      className={cn(
        // layout
        "rounded-xl p-5",
        // background
        "bg-white dark:bg-zinc-800/50",
        // border
        "border-2",
        isError
          ? "border-red-200 dark:border-red-900/50"
          : "border-emerald-200 dark:border-emerald-900/50"
      )}
    >
      {/* 제목 */}
      <div
        className={cn(
          // layout
          "flex items-center gap-2 mb-2"
        )}
      >
        <h4
          className={cn(
            // typography
            "font-semibold",
            // color
            isError
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {title}
        </h4>
      </div>

      {/* 설명 */}
      <p
        className={cn(
          // typography
          "text-sm mb-4",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        {description}
      </p>

      {/* 입력창 - uncontrolled면 value prop 제거 */}
      <input
        ref={inputRef}
        type="text"
        {...(uncontrolled ? {} : { value })}
        onChange={onChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder="여기에 한글을 입력하세요..."
        className={cn(
          // layout
          "w-full px-4 py-3 rounded-lg",
          // typography
          "text-base",
          // background
          "bg-zinc-50 dark:bg-zinc-900",
          // border
          "border-2",
          isError
            ? "border-red-300 dark:border-red-800 focus:border-red-400 dark:focus:border-red-700"
            : "border-emerald-300 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-700",
          // color
          "text-zinc-900 dark:text-zinc-100",
          // placeholder
          "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
          // focus
          "outline-none",
          // transition
          "transition-colors"
        )}
      />

      {/* 결과 표시 */}
      <div
        className={cn(
          // layout
          "mt-4 p-3 rounded-lg",
          // background
          "bg-zinc-100 dark:bg-zinc-900"
        )}
      >
        <div
          className={cn(
            // layout
            "flex items-center justify-between mb-1"
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
            결과값
          </span>
          <span
            className={cn(
              // typography
              "text-xs",
              // color
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            {value.length}자
          </span>
        </div>
        <code
          className={cn(
            // layout
            "block",
            // typography
            "text-sm font-mono break-all",
            // color
            "text-zinc-900 dark:text-zinc-100"
          )}
        >
          {value || "(빈 문자열)"}
        </code>
      </div>

      {/* 코드 힌트 */}
      <div
        className={cn(
          // layout
          "mt-3 px-3 py-2 rounded-md",
          // background
          isError
            ? "bg-red-50 dark:bg-red-950/30"
            : "bg-emerald-50 dark:bg-emerald-950/30"
        )}
      >
        <code
          className={cn(
            // typography
            "text-xs font-mono",
            // color
            isError
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {code}
        </code>
      </div>
    </div>
  );
}

