"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import { useSlide } from "../context/slide-context";

type SlideControlsProps = {
  slug: string;
};

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
        "min-w-[200px]",
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
        <li className="flex justify-between">
          <span>다음</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
            → / Space
          </kbd>
        </li>
        <li className="flex justify-between">
          <span>이전</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
            ←
          </kbd>
        </li>
        <li className="flex justify-between">
          <span>처음으로</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
            Home
          </kbd>
        </li>
        <li className="flex justify-between">
          <span>끝으로</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
            End
          </kbd>
        </li>
        <li className="flex justify-between">
          <span>나가기</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
            Esc
          </kbd>
        </li>
      </ul>
    </div>
  );
}

export function SlideControls({ slug }: SlideControlsProps) {
  const { currentIndex, totalSlides, next, prev } = useSlide();
  const [showHelp, setShowHelp] = useState(false);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  return (
    <footer
      className={cn(
        "flex items-center justify-between",
        "px-6 py-4",
        "border-t border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-950",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          disabled={isFirst}
          className={cn(
            "p-2 rounded-lg",
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
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={isLast}
          className={cn(
            "p-2 rounded-lg",
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
          >
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "text-sm font-medium",
          "text-zinc-600 dark:text-zinc-400",
        )}
      >
        <span className="text-zinc-900 dark:text-zinc-100">
          {currentIndex + 1}
        </span>
        <span className="mx-1">/</span>
        <span>{totalSlides}</span>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={cn(
            "p-2 rounded-lg",
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
            strokeWidth="2"
          >
            <rect x="4" y="6" width="12" height="10" rx="2" />
            <line x1="7" y1="10" x2="7" y2="10" strokeLinecap="round" />
            <line x1="10" y1="10" x2="10" y2="10" strokeLinecap="round" />
            <line x1="13" y1="10" x2="13" y2="10" strokeLinecap="round" />
            <line x1="7" y1="13" x2="13" y2="13" />
          </svg>
        </button>
        {showHelp && (
          <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />
        )}
        <Link
          href={`/posts/${slug}`}
          className={cn(
            "p-2 rounded-lg",
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
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
