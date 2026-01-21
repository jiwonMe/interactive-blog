"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { SlideProvider, useSlide } from "../context/slide-context";
import { SlideControls } from "./slide-controls";
import { useSlideNavigation } from "../hooks/use-slide-navigation";

type SlideViewerProps = {
  children: ReactNode[];
  slug: string;
  title: string;
  initialSlide?: number;
};

function SlideViewerInner({
  children,
  slug,
  title,
}: Omit<SlideViewerProps, "initialSlide">) {
  const { currentIndex, totalSlides } = useSlide();
  useSlideNavigation(slug);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "flex flex-col",
        "bg-white dark:bg-zinc-950",
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between",
          "px-6 py-4",
          "border-b border-zinc-200 dark:border-zinc-800",
        )}
      >
        <a
          href={`/posts/${slug}`}
          className={cn(
            "text-sm font-medium",
            "text-zinc-600 dark:text-zinc-400",
            "hover:text-zinc-900 dark:hover:text-zinc-100",
            "transition-colors",
          )}
        >
          ← 포스트로 돌아가기
        </a>
        <h1
          className={cn(
            "text-sm font-medium",
            "text-zinc-900 dark:text-zinc-100",
            "truncate max-w-[50%]",
          )}
        >
          {title}
        </h1>
        <div className="w-[120px]" />
      </header>

      <main className={cn("flex-1 relative overflow-hidden")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={cn(
              "absolute inset-0",
              "flex items-center justify-center",
              "p-8 md:p-16",
              "overflow-auto",
            )}
          >
            <div
              className={cn(
                "w-full max-w-5xl",
                "slide-content",
                "prose prose-lg md:prose-xl lg:prose-2xl dark:prose-invert",
                "prose-headings:text-center prose-headings:mb-8",
                "prose-p:text-center",
                "prose-ul:text-left prose-ol:text-left",
                "prose-pre:text-sm md:prose-pre:text-base",
              )}
            >
              {children[currentIndex]}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <SlideControls slug={slug} />
    </div>
  );
}

export function SlideViewer({
  children,
  slug,
  title,
  initialSlide = 0,
}: SlideViewerProps) {
  return (
    <SlideProvider totalSlides={children.length} initialIndex={initialSlide}>
      <SlideViewerInner slug={slug} title={title}>
        {children}
      </SlideViewerInner>
    </SlideProvider>
  );
}
