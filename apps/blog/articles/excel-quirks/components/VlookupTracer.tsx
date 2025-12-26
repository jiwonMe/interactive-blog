"use client";

import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { TraceInfo } from "./VlookupDefaultRisk.types";

interface VlookupTracerProps {
  trace: TraceInfo | null;
  currentStepIndex: number | null;
  isPlaying: boolean;
  handlePlay: () => void;
  handlePause: () => void;
  handleReset: () => void;
}

export function VlookupTracer({
  trace,
  currentStepIndex,
  isPlaying,
  handlePlay,
  handlePause,
  handleReset,
}: VlookupTracerProps) {
  if (!trace || trace.steps.length === 0) return null;

  return (
    <div
      className={cn(
        /* layout */
        "px-3 py-2 border-t",
        /* background */
        "bg-zinc-50/50 dark:bg-zinc-900/30",
        /* border */
        "border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* layout */
          "flex items-center justify-between mb-2"
        )}
      >
        <span
          className={cn(
            /* typography */
            "text-[9px] font-bold text-zinc-500 uppercase tracking-widest"
          )}
        >
          Binary Search 과정:
        </span>
        <div
          className={cn(
            /* layout */
            "flex items-center gap-1"
          )}
        >
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className={cn(
                /* layout */
                "flex items-center gap-1 px-2 py-0.5",
                /* typography */
                "text-[9px] font-bold text-emerald-600 dark:text-emerald-400",
                /* background */
                "bg-emerald-50 dark:bg-emerald-900/20",
                /* border */
                "border border-emerald-200 dark:border-emerald-800 rounded-sm",
                /* interaction */
                "hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
              )}
            >
              <Play className="w-2.5 h-2.5" />
              재생
            </button>
          ) : (
            <button
              onClick={handlePause}
              className={cn(
                /* layout */
                "flex items-center gap-1 px-2 py-0.5",
                /* typography */
                "text-[9px] font-bold text-amber-600 dark:text-amber-400",
                /* background */
                "bg-amber-50 dark:bg-amber-900/20",
                /* border */
                "border border-amber-200 dark:border-amber-800 rounded-sm",
                /* interaction */
                "hover:bg-amber-100 dark:hover:bg-amber-900/30"
              )}
            >
              <Pause className="w-2.5 h-2.5" />
              일시정지
            </button>
          )}
          <button
            onClick={handleReset}
            className={cn(
              /* layout */
              "flex items-center gap-1 px-2 py-0.5",
              /* typography */
              "text-[9px] font-bold text-zinc-600 dark:text-zinc-400",
              /* background */
              "bg-zinc-100 dark:bg-zinc-800",
              /* border */
              "border border-zinc-200 dark:border-zinc-700 rounded-sm",
              /* interaction */
              "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            리셋
          </button>
        </div>
      </div>
      <div
        className={cn(
          /* layout */
          "flex flex-wrap gap-2"
        )}
      >
        <AnimatePresence mode="wait">
          {trace.steps.map((step, stepIdx) => {
            const isActive = currentStepIndex === stepIdx;
            const isPast = currentStepIndex !== null && stepIdx < currentStepIndex;
            return (
              <motion.div
                key={stepIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive || isPast ? 1 : 0.4,
                  scale: isActive ? 1.05 : 1,
                  borderColor: isActive ? "rgb(245 158 11)" : undefined,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  /* layout */
                  "flex items-center gap-2 px-2 py-1.5",
                  /* background */
                  "bg-white dark:bg-zinc-800",
                  /* border */
                  "border rounded-sm transition-all",
                  isActive
                    ? cn(
                        /* effect */
                        "border-amber-500 shadow-md ring-2 ring-amber-500/20"
                      )
                    : cn(
                        /* border */
                        "border-zinc-200 dark:border-zinc-700"
                      ),
                  isPast && !isActive
                    ? cn(
                        /* layout */
                        "opacity-60"
                      )
                    : "",
                  step.label === "결과" && trace.isCorrect
                    ? cn(
                        /* background */
                        "bg-emerald-50 dark:bg-emerald-900/20"
                      )
                    : "",
                  step.label === "결과" && !trace.isCorrect
                    ? cn(
                        /* background */
                        "bg-red-50 dark:bg-red-900/20"
                      )
                    : ""
                )}
              >
                <span
                  className={cn(
                    /* typography */
                    "text-[8px] font-bold text-white uppercase",
                    /* layout */
                    "px-1.5 py-0.5 rounded-[1px] shrink-0",
                    step.label === "결과"
                      ? trace.isCorrect
                        ? cn(
                            /* background */
                            "bg-emerald-500 shadow-sm"
                          )
                        : cn(
                            /* background */
                            "bg-red-500 shadow-sm"
                          )
                      : isActive
                        ? cn(
                            /* background */
                            "bg-amber-500"
                          )
                        : cn(
                            /* background */
                            "bg-zinc-400 dark:bg-zinc-600"
                          )
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    /* typography */
                    "text-[9px] font-mono",
                    /* layout */
                    "px-1 py-0.5 rounded",
                    /* background */
                    "bg-blue-100 dark:bg-blue-900/30",
                    /* border */
                    "border border-blue-200 dark:border-blue-800",
                    isActive
                      ? cn(
                          /* color */
                          "text-blue-700 dark:text-blue-300"
                        )
                      : cn(
                          /* color */
                          "text-blue-500"
                        )
                  )}
                >
                  {step.rangeStart === step.rangeEnd
                    ? `${step.rangeStart}행`
                    : `${step.rangeStart}~${step.rangeEnd}행`}
                </span>
                <span
                  className={cn(
                    /* typography */
                    "text-[10px] font-mono font-bold",
                    isActive
                      ? cn(
                          /* color */
                          "text-amber-700 dark:text-amber-300"
                        )
                      : cn(
                          /* color */
                          "text-zinc-600 dark:text-zinc-300"
                        )
                  )}
                >
                  →A{step.idx + 1}
                </span>
                <span
                  className={cn(
                    /* typography */
                    "text-[10px]",
                    isActive
                      ? cn(
                          /* color */
                          "text-zinc-700 dark:text-zinc-200"
                        )
                      : cn(
                          /* color */
                          "text-zinc-400"
                        ),
                    step.label === "결과" && trace.isCorrect
                      ? cn(
                          /* color */
                          "text-emerald-600 dark:text-emerald-400"
                        )
                      : "",
                    step.label === "결과" && !trace.isCorrect
                      ? cn(
                          /* color */
                          "text-red-600 dark:text-red-400"
                        )
                      : "",
                    /* layout */
                    "truncate"
                  )}
                >
                  {step.msg}
                </span>
                {isActive && step.label !== "결과" && (
                  <motion.span
                    className={cn(
                      /* layout */
                      "w-1.5 h-1.5",
                      /* background */
                      "bg-amber-500 rounded-full"
                    )}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

