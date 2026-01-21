"use client";

import { type ReactNode, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

type InlineSlideViewerProps = {
  children: ReactNode[];
  slug: string;
};

export function InlineSlideViewer({ children, slug }: InlineSlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = children.length;

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  return (
    <div className="my-8">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "bg-zinc-100 dark:bg-zinc-900",
          "rounded-xl border border-zinc-200 dark:border-zinc-800",
        )}
        style={{ aspectRatio: "16/9" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full h-full"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "absolute inset-2 sm:inset-4",
                  "bg-white dark:bg-zinc-950",
                  "rounded-lg shadow-lg",
                  "overflow-hidden",
                )}
              >
                <div
                  className="absolute inset-0 overflow-auto"
                  style={{
                    transform: `scale(${0.5})`,
                    transformOrigin: "top left",
                    width: SLIDE_WIDTH,
                    height: SLIDE_HEIGHT,
                    padding: "64px",
                  }}
                >
                  <div className="slide-content h-full flex flex-col justify-center">
                    {children[currentIndex]}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={prev}
          disabled={isFirst}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10",
            "p-2 rounded-full",
            "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm",
            "border border-zinc-200 dark:border-zinc-700",
            "transition-all",
            isFirst
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:bg-white dark:hover:bg-zinc-800",
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
            className="text-zinc-700 dark:text-zinc-300"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>

        <button
          onClick={next}
          disabled={isLast}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10",
            "p-2 rounded-full",
            "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm",
            "border border-zinc-200 dark:border-zinc-700",
            "transition-all",
            isLast
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:bg-white dark:hover:bg-zinc-800",
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
            className="text-zinc-700 dark:text-zinc-300"
          >
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className={cn("flex items-center justify-between", "mt-3 px-1")}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "text-sm font-medium tabular-nums",
              "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {currentIndex + 1} / {totalSlides}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === currentIndex
                    ? "bg-zinc-900 dark:bg-zinc-100 w-4"
                    : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600",
                )}
                aria-label={`슬라이드 ${i + 1}로 이동`}
              />
            ))}
          </div>
        </div>

        <Link
          href={`/slides/${slug}`}
          className={cn(
            "inline-flex items-center gap-2",
            "px-3 py-1.5 rounded-lg",
            "text-sm font-medium",
            "bg-zinc-100 dark:bg-zinc-800",
            "text-zinc-700 dark:text-zinc-300",
            "hover:bg-zinc-200 dark:hover:bg-zinc-700",
            "transition-colors",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 8V5h3" />
            <path d="M16 8V5h-3" />
            <path d="M4 12v3h3" />
            <path d="M16 12v3h-3" />
          </svg>
          전체화면
        </Link>
      </div>
    </div>
  );
}
