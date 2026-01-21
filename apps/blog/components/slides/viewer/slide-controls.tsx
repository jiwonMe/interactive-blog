"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import { useSlide } from "../context/slide-context";

type SlideControlsProps = {
  slug: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  visible: boolean;
};

function ProgressBar({ isFullscreen }: { isFullscreen: boolean }) {
  const { currentIndex, totalSlides } = useSlide();
  const progress = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div
      className={cn(
        "h-1 bg-zinc-200 dark:bg-zinc-800",
        isFullscreen
          ? "absolute bottom-full left-0 right-0 bg-white/20"
          : "absolute top-0 left-0 right-0",
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 ease-out",
          isFullscreen ? "bg-white/80" : "bg-zinc-900 dark:bg-zinc-100",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function KeyboardShortcutsHelp({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={cn(
        "absolute bottom-full right-0 mb-2",
        "p-4 rounded-lg",
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200 dark:border-zinc-700",
        "shadow-lg",
        "text-sm",
        "min-w-[220px]",
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          단축키
        </span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
        <li className="flex justify-between gap-4">
          <span>다음</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            → / Space
          </kbd>
        </li>
        <li className="flex justify-between gap-4">
          <span>이전</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            ←
          </kbd>
        </li>
        <li className="flex justify-between gap-4">
          <span>처음으로</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            Home
          </kbd>
        </li>
        <li className="flex justify-between gap-4">
          <span>끝으로</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            End
          </kbd>
        </li>
        <li className="flex justify-between gap-4">
          <span>전체화면</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            F
          </kbd>
        </li>
        <li className="flex justify-between gap-4">
          <span>나가기</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
            Esc
          </kbd>
        </li>
      </ul>
    </div>
  );
}

export function SlideControls({
  slug,
  isFullscreen,
  onToggleFullscreen,
  visible,
}: SlideControlsProps) {
  const { currentIndex, totalSlides, next, prev } = useSlide();
  const [showHelp, setShowHelp] = useState(false);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  if (isFullscreen) {
    return (
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "flex items-center gap-2",
          "px-4 py-2 rounded-full",
          "bg-black/70 backdrop-blur-md",
          "transition-all duration-300",
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <ProgressBar isFullscreen />

        <button
          onClick={prev}
          disabled={isFirst}
          className={cn(
            "p-2 rounded-full",
            "transition-colors",
            isFirst
              ? "text-white/30 cursor-not-allowed"
              : "text-white/80 hover:text-white hover:bg-white/10",
          )}
          aria-label="이전 슬라이드"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>

        <div className="px-3 text-sm font-medium tabular-nums text-white/90">
          {currentIndex + 1} / {totalSlides}
        </div>

        <button
          onClick={next}
          disabled={isLast}
          className={cn(
            "p-2 rounded-full",
            "transition-colors",
            isLast
              ? "text-white/30 cursor-not-allowed"
              : "text-white/80 hover:text-white hover:bg-white/10",
          )}
          aria-label="다음 슬라이드"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={onToggleFullscreen}
          className={cn(
            "p-2 rounded-full",
            "text-white/80 hover:text-white hover:bg-white/10",
            "transition-colors",
          )}
          aria-label="전체화면 종료"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h3v3" />
            <path d="M16 12h-3v3" />
            <path d="M4 8h3V5" />
            <path d="M16 8h-3V5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <footer
      className={cn(
        "relative",
        "flex-none h-16",
        "flex items-center justify-between",
        "px-6",
        "bg-white dark:bg-zinc-950",
        "border-t border-zinc-200 dark:border-zinc-800",
      )}
    >
      <ProgressBar isFullscreen={false} />

      <div className="flex items-center gap-1">
        <button
          onClick={prev}
          disabled={isFirst}
          className={cn(
            "p-2.5 rounded-lg",
            "transition-colors",
            isFirst
              ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          )}
          aria-label="이전 슬라이드"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={isLast}
          className={cn(
            "p-2.5 rounded-lg",
            "transition-colors",
            isLast
              ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          )}
          aria-label="다음 슬라이드"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "text-sm font-medium tabular-nums",
          "text-zinc-600 dark:text-zinc-400",
        )}
      >
        <span className="text-zinc-900 dark:text-zinc-100">
          {currentIndex + 1}
        </span>
        <span className="mx-1">/</span>
        <span>{totalSlides}</span>
      </div>

      <div className="flex items-center gap-1 relative">
        <button
          onClick={onToggleFullscreen}
          className={cn(
            "p-2.5 rounded-lg",
            "text-zinc-600 dark:text-zinc-400",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "transition-colors",
          )}
          aria-label="전체화면"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 8V5h3" />
            <path d="M16 8V5h-3" />
            <path d="M4 12v3h3" />
            <path d="M16 12v3h-3" />
          </svg>
        </button>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={cn(
            "p-2.5 rounded-lg",
            "text-zinc-600 dark:text-zinc-400",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "transition-colors",
          )}
          aria-label="단축키 도움말"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10" cy="10" r="7" />
            <path d="M8 8a2 2 0 1 1 2 2v1.5" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.5" fill="currentColor" />
          </svg>
        </button>
        {showHelp && (
          <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />
        )}
        <Link
          href={`/posts/${slug}`}
          className={cn(
            "p-2.5 rounded-lg",
            "text-zinc-600 dark:text-zinc-400",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "transition-colors",
          )}
          aria-label="슬라이드 나가기"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l8 8M14 6l-8 8" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
