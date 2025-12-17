"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { LUMINANCE_WEIGHTS } from "./luminanceUtils";

export interface LuminanceWeightVisualizationProps {
  r: number;
  g: number;
  b: number;
  className?: string;
}

export function LuminanceWeightVisualization({
  r,
  g,
  b,
  className,
}: LuminanceWeightVisualizationProps) {
  const contributions = {
    r: LUMINANCE_WEIGHTS.r * (r / 255),
    g: LUMINANCE_WEIGHTS.g * (g / 255),
    b: LUMINANCE_WEIGHTS.b * (b / 255),
  };
  const totalLuminance = contributions.r + contributions.g + contributions.b;

  const maxContribution = Math.max(
    contributions.r,
    contributions.g,
    contributions.b,
    0.01
  );

  return (
    <div
      className={cn(
        /* layout */
        "space-y-3",
        className
      )}
    >
      <div
        className={cn(
          /* layout */
          "space-y-2"
        )}
      >
        {/* 가중치 표시 */}
        <div
          className={cn(
            /* layout */
            "flex items-center gap-2"
          )}
        >
          <div
            className={cn(
              /* typography */
              "text-xs font-medium",
              /* color */
              "text-zinc-600 dark:text-zinc-400",
              /* width */
              "w-16"
            )}
          >
            가중치
          </div>
          <div
            className={cn(
              /* layout */
              "flex-1 flex gap-1"
            )}
          >
            <div
              className={cn(
                /* layout */
                "flex-1 h-4 rounded",
                /* background */
                "bg-red-500/30 dark:bg-red-500/20",
                /* border */
                "border border-red-500/50 dark:border-red-500/30"
              )}
              style={{
                width: `${(LUMINANCE_WEIGHTS.r / 1) * 100}%`,
              }}
              title={`R: ${(LUMINANCE_WEIGHTS.r * 100).toFixed(1)}%`}
            />
            <div
              className={cn(
                /* layout */
                "flex-1 h-4 rounded",
                /* background */
                "bg-green-500/30 dark:bg-green-500/20",
                /* border */
                "border border-green-500/50 dark:border-green-500/30"
              )}
              style={{
                width: `${(LUMINANCE_WEIGHTS.g / 1) * 100}%`,
              }}
              title={`G: ${(LUMINANCE_WEIGHTS.g * 100).toFixed(1)}%`}
            />
            <div
              className={cn(
                /* layout */
                "flex-1 h-4 rounded",
                /* background */
                "bg-blue-500/30 dark:bg-blue-500/20",
                /* border */
                "border border-blue-500/50 dark:border-blue-500/30"
              )}
              style={{
                width: `${(LUMINANCE_WEIGHTS.b / 1) * 100}%`,
              }}
              title={`B: ${(LUMINANCE_WEIGHTS.b * 100).toFixed(1)}%`}
            />
          </div>
        </div>

        {/* 기여도 표시 */}
        <div
          className={cn(
            /* layout */
            "space-y-1.5"
          )}
        >
          <div
            className={cn(
              /* typography */
              "text-xs font-medium",
              /* color */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            현재 색상의 휘도 기여도
          </div>
          <div
            className={cn(
              /* layout */
              "space-y-1"
            )}
          >
            {/* R 기여도 */}
            <div
              className={cn(
                /* layout */
                "flex items-center gap-2"
              )}
            >
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-500 dark:text-zinc-500",
                  /* width */
                  "w-8"
                )}
              >
                R
              </div>
              <div
                className={cn(
                  /* layout */
                  "flex-1 h-3 rounded",
                  /* background */
                  "bg-zinc-200 dark:bg-zinc-800"
                )}
              >
                <div
                  className={cn(
                    /* layout */
                    "h-full rounded",
                    /* background */
                    "bg-red-500"
                  )}
                  style={{
                    width: `${(contributions.r / maxContribution) * 100}%`,
                  }}
                />
              </div>
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-600 dark:text-zinc-400",
                  /* width */
                  "w-12 text-right"
                )}
              >
                {contributions.r.toFixed(3)}
              </div>
            </div>

            {/* G 기여도 */}
            <div
              className={cn(
                /* layout */
                "flex items-center gap-2"
              )}
            >
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-500 dark:text-zinc-500",
                  /* width */
                  "w-8"
                )}
              >
                G
              </div>
              <div
                className={cn(
                  /* layout */
                  "flex-1 h-3 rounded",
                  /* background */
                  "bg-zinc-200 dark:bg-zinc-800"
                )}
              >
                <div
                  className={cn(
                    /* layout */
                    "h-full rounded",
                    /* background */
                    "bg-green-500"
                  )}
                  style={{
                    width: `${(contributions.g / maxContribution) * 100}%`,
                  }}
                />
              </div>
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-600 dark:text-zinc-400",
                  /* width */
                  "w-12 text-right"
                )}
              >
                {contributions.g.toFixed(3)}
              </div>
            </div>

            {/* B 기여도 */}
            <div
              className={cn(
                /* layout */
                "flex items-center gap-2"
              )}
            >
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-500 dark:text-zinc-500",
                  /* width */
                  "w-8"
                )}
              >
                B
              </div>
              <div
                className={cn(
                  /* layout */
                  "flex-1 h-3 rounded",
                  /* background */
                  "bg-zinc-200 dark:bg-zinc-800"
                )}
              >
                <div
                  className={cn(
                    /* layout */
                    "h-full rounded",
                    /* background */
                    "bg-blue-500"
                  )}
                  style={{
                    width: `${(contributions.b / maxContribution) * 100}%`,
                  }}
                />
              </div>
              <div
                className={cn(
                  /* typography */
                  "text-xs font-mono",
                  /* color */
                  "text-zinc-600 dark:text-zinc-400",
                  /* width */
                  "w-12 text-right"
                )}
              >
                {contributions.b.toFixed(3)}
              </div>
            </div>
          </div>

          {/* 총 휘도 */}
          <div
            className={cn(
              /* layout */
              "flex items-center justify-between",
              /* spacing */
              "pt-2 mt-2",
              /* border */
              "border-t border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div
              className={cn(
                /* typography */
                "text-sm font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              총 휘도 (Y)
            </div>
            <div
              className={cn(
                /* typography */
                "text-sm font-mono font-semibold",
                /* color */
                "text-zinc-900 dark:text-zinc-100"
              )}
            >
              {totalLuminance.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
