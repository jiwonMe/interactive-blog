"use client";

import {
  type ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { SlideProvider, useSlide } from "../context/slide-context";
import { SlideControls } from "./slide-controls";
import { useSlideNavigation } from "../hooks/use-slide-navigation";
import { useFullscreen } from "../hooks/use-fullscreen";
import { PwnzLogo } from "../../pwnz-logo";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

type SlideViewerProps = {
  children: ReactNode[];
  slug: string;
  title: string;
  initialSlide?: number;
};

function useSlideScale(isFullscreen: boolean) {
  const [scale, setScale] = useState(1);

  const calculateScale = useCallback(() => {
    if (isFullscreen) {
      const scaleX = window.innerWidth / SLIDE_WIDTH;
      const scaleY = window.innerHeight / SLIDE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    } else {
      const headerHeight = 56;
      const footerHeight = 64;
      const padding = 32;

      const availableWidth = window.innerWidth - padding * 2;
      const availableHeight =
        window.innerHeight - headerHeight - footerHeight - padding * 2;

      const scaleX = availableWidth / SLIDE_WIDTH;
      const scaleY = availableHeight / SLIDE_HEIGHT;

      setScale(Math.min(scaleX, scaleY, 2));
    }
  }, [isFullscreen]);

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [calculateScale]);

  return scale;
}

function useIdleDetection(timeout: number = 2000) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return isIdle;
}

function SlideViewerInner({
  children,
  slug,
  title,
}: Omit<SlideViewerProps, "initialSlide">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentIndex, totalSlides } = useSlide();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const scale = useSlideScale(isFullscreen);
  const isIdle = useIdleDetection(2000);
  useSlideNavigation(slug, { onToggleFullscreen: toggleFullscreen });

  const showControls = !isFullscreen || !isIdle;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50",
        "flex flex-col",
        isFullscreen ? "bg-black" : "bg-zinc-100 dark:bg-zinc-900",
        isFullscreen && isIdle && "cursor-none",
      )}
    >
      <header
        className={cn(
          "flex-none",
          "flex items-center justify-between",
          "px-6",
          "bg-white dark:bg-zinc-950",
          "border-b border-zinc-200 dark:border-zinc-800",
          "transition-all duration-300",
          isFullscreen ? "h-0 opacity-0 overflow-hidden" : "h-14 opacity-100",
        )}
      >
        <a
          href="/"
          className={cn(
            "text-zinc-900 dark:text-zinc-100",
            "hover:text-zinc-600 dark:hover:text-zinc-400",
            "transition-colors",
          )}
          aria-label="홈으로"
        >
          <PwnzLogo width={80} />
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
        <div
          className={cn(
            "text-sm",
            "text-zinc-500 dark:text-zinc-500",
            "tabular-nums",
          )}
        >
          {currentIndex + 1} / {totalSlides}
        </div>
      </header>

      <main
        className={cn(
          "flex-1",
          "flex items-center justify-center",
          "overflow-hidden",
        )}
      >
        <div
          className="relative"
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "absolute inset-0",
                "bg-white dark:bg-zinc-950",
                "overflow-hidden",
                isFullscreen
                  ? "rounded-none shadow-none"
                  : "rounded-lg shadow-2xl",
              )}
            >
              <div
                className={cn("absolute inset-0", "p-16", "overflow-hidden")}
              >
                <div className="slide-content relative h-full flex flex-col justify-center">
                  {children[currentIndex]}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SlideControls
        slug={slug}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        visible={showControls}
      />
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
