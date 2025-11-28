"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "../../../lib/utils";

/**
 * 이벤트 로그 타입
 */
interface EventLog {
  id: number;
  type: "keydown" | "keyup" | "compositionstart" | "compositionupdate" | "compositionend" | "input";
  data: string;
  timestamp: number;
}

/**
 * 이벤트 타입별 색상 및 스타일
 * 더 선명하고 구분되는 색상 사용
 */
const eventStyles: Record<EventLog["type"], { bg: string; text: string; border: string; label: string }> = {
  keydown: {
    // 파란색 - 키 누름
    bg: "bg-blue-500/20 dark:bg-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-l-2 border-blue-500",
    label: "keydown",
  },
  keyup: {
    // 회색 - 키 뗌 (덜 중요)
    bg: "bg-zinc-500/10 dark:bg-zinc-500/20",
    text: "text-zinc-500 dark:text-zinc-500",
    border: "border-l-2 border-zinc-400",
    label: "keyup",
  },
  compositionstart: {
    // 노란색 - 조합 시작
    bg: "bg-yellow-500/20 dark:bg-yellow-500/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-l-2 border-yellow-500",
    label: "comp:start",
  },
  compositionupdate: {
    // 주황색 - 조합 중
    bg: "bg-orange-500/20 dark:bg-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-l-2 border-orange-500",
    label: "comp:update",
  },
  compositionend: {
    // 초록색 - 조합 완료
    bg: "bg-green-500/20 dark:bg-green-500/30",
    text: "text-green-600 dark:text-green-400",
    border: "border-l-2 border-green-500",
    label: "comp:end",
  },
  input: {
    // 보라색 - input 이벤트
    bg: "bg-violet-500/20 dark:bg-violet-500/30",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-l-2 border-violet-500",
    label: "input",
  },
};

/**
 * Composition Event를 실시간으로 로깅하는 컴포넌트
 */
export function CompositionEventLogger() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const logIdRef = useRef(0);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // 로그 추가
  const addLog = useCallback((type: EventLog["type"], data: string) => {
    const newLog: EventLog = {
      id: ++logIdRef.current,
      type,
      data,
      timestamp: Date.now(),
    };
    setLogs((prev) => [...prev.slice(-50), newLog]); // 최대 50개 유지
  }, []);

  // 자동 스크롤
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // 이벤트 핸들러들
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const info = `key="${e.key}" keyCode=${e.keyCode} isComposing=${e.nativeEvent.isComposing}`;
    addLog("keydown", info);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const info = `key="${e.key}" keyCode=${e.keyCode}`;
    addLog("keyup", info);
  };

  const handleCompositionStart = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(true);
    addLog("compositionstart", `data="${e.data}"`);
  };

  const handleCompositionUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
    addLog("compositionupdate", `data="${e.data}"`);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    addLog("compositionend", `data="${e.data}"`);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
    addLog("input", `value="${target.value}"`);
  };

  const handleClear = () => {
    setLogs([]);
    setInputValue("");
    logIdRef.current = 0;
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
        <div className="flex items-center gap-3">
          <h3
            className={cn(
              // typography
              "text-lg font-semibold",
              // color
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            이벤트 로거
          </h3>
          {/* 조합 상태 표시 */}
          <ComposingBadge isComposing={isComposing} />
        </div>
        <button
          onClick={handleClear}
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

      {/* 입력 영역 */}
      <div
        className={cn(
          // layout
          "p-5",
          // background
          "bg-white dark:bg-zinc-950"
        )}
      >
        <input
          type="text"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          onInput={handleInput}
          placeholder="여기에 한글을 입력해보세요..."
          className={cn(
            // layout
            "w-full px-4 py-3 rounded-xl",
            // typography
            "text-base",
            // background
            "bg-zinc-50 dark:bg-zinc-900",
            // border
            "border-2 border-zinc-300 dark:border-zinc-700",
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

      {/* 로그 영역 */}
      <div
        ref={logsContainerRef}
        className={cn(
          // layout
          "h-64 overflow-y-auto px-4 py-3",
          // background
          "bg-zinc-950"
        )}
      >
        {logs.length === 0 ? (
          <div
            className={cn(
              // layout
              "h-full flex items-center justify-center",
              // typography
              "text-sm",
              // color
              "text-zinc-500"
            )}
          >
            입력하면 이벤트가 여기에 표시됩니다
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>

      {/* 범례 */}
      <div
        className={cn(
          // layout
          "px-5 py-3 flex flex-wrap gap-4",
          // background
          "bg-zinc-100 dark:bg-zinc-900",
          // border
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        {Object.entries(eventStyles).map(([type, style]) => (
          <div
            key={type}
            className={cn(
              // layout
              "flex items-center gap-2 px-2 py-1 rounded",
              // background
              style.bg
            )}
          >
            <span
              className={cn(
                // layout
                "w-3 h-3 rounded-sm",
                // border
                style.border,
                // background
                "bg-current opacity-80"
              )}
              style={{
                borderLeftWidth: "3px",
              }}
            />
            <span
              className={cn(
                // typography
                "text-xs font-medium font-mono",
                // color
                style.text
              )}
            >
              {style.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 조합 상태 배지
 */
function ComposingBadge({ isComposing }: { isComposing: boolean }) {
  return (
    <span
      className={cn(
        // layout
        "px-2.5 py-1 rounded-full",
        // typography
        "text-xs font-medium",
        // transition
        "transition-all duration-200",
        // conditional styles
        isComposing
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
          : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
      )}
    >
      {isComposing ? "조합 중" : "대기"}
    </span>
  );
}

/**
 * 로그 항목 컴포넌트
 */
function LogEntry({ log }: { log: EventLog }) {
  const style = eventStyles[log.type];

  return (
    <div
      className={cn(
        // layout
        "flex items-start gap-3 py-2 px-3 rounded-r",
        // border - 왼쪽에 색상 바
        style.border,
        // background - 더 투명하게
        "bg-zinc-800/50",
        // hover
        "hover:bg-zinc-700/50"
      )}
    >
      {/* 이벤트 타입 배지 */}
      <span
        className={cn(
          // layout
          "shrink-0 min-w-[90px] px-2 py-0.5 rounded text-xs font-mono font-semibold",
          // background
          style.bg,
          // color
          style.text
        )}
      >
        {style.label}
      </span>
      {/* 데이터 */}
      <code
        className={cn(
          // typography
          "text-xs font-mono break-all",
          // color - 더 밝게
          "text-zinc-100"
        )}
      >
        {log.data}
      </code>
    </div>
  );
}

