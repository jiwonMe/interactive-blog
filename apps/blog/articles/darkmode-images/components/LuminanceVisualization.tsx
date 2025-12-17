"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import {
  calculateLuminance,
  invertByLuminance,
  rgbToHex,
} from "./luminanceUtils";
import { RGBSlider } from "./RGBSlider";
import { LuminanceWeightVisualization } from "./LuminanceWeightVisualization";

export interface LuminanceVisualizationProps {
  defaultR?: number;
  defaultG?: number;
  defaultB?: number;
}

export function LuminanceVisualization({
  defaultR = 255,
  defaultG = 100,
  defaultB = 50,
}: LuminanceVisualizationProps) {
  const [r, setR] = React.useState(defaultR);
  const [g, setG] = React.useState(defaultG);
  const [b, setB] = React.useState(defaultB);

  const luminance = calculateLuminance(r, g, b);
  const [rInverted, gInverted, bInverted] = invertByLuminance(r, g, b);
  const luminanceInverted = calculateLuminance(rInverted, gInverted, bInverted);

  const colorHex = rgbToHex(r, g, b);
  const invertedColorHex = rgbToHex(rInverted, gInverted, bInverted);

  return (
    <div
      className={cn(
        /* layout */
        "my-10 w-full",
        "rounded-2xl",
        "px-3 py-4",
        "sm:px-4 sm:py-5",
        "md:p-6",
        /* spacing */
        "space-y-6",
        /* background */
        "bg-zinc-50 dark:bg-zinc-900",
        /* border */
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* 헤더 */}
      <div
        className={cn(
          /* layout */
          "space-y-1"
        )}
      >
        <h3
          className={cn(
            /* typography */
            "text-lg font-semibold",
            /* color */
            "text-zinc-900 dark:text-zinc-100"
          )}
        >
          휘도 계산 시각화
        </h3>
        <p
          className={cn(
            /* typography */
            "text-sm leading-relaxed",
            /* color */
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          RGB 값을 조절하면 휘도가 어떻게 계산되는지, 그리고 휘도 기반 반전이 어떻게 작동하는지 확인할 수 있습니다.
        </p>
      </div>

      <div
        className={cn(
          /* layout */
          "grid gap-6",
          "lg:grid-cols-2"
        )}
      >
        {/* 왼쪽: 컨트롤 */}
        <div
          className={cn(
            /* layout */
            "space-y-6"
          )}
        >
          {/* RGB 슬라이더 */}
          <div
            className={cn(
              /* layout */
              "space-y-4",
              /* padding */
              "p-4 rounded-xl",
              /* background */
              "bg-white dark:bg-zinc-950",
              /* border */
              "border border-zinc-200 dark:border-zinc-800"
            )}
          >
            <h4
              className={cn(
                /* typography */
                "text-sm font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              RGB 값 조절
            </h4>
            <div
              className={cn(
                /* layout */
                "space-y-4"
              )}
            >
              <RGBSlider
                label="Red"
                value={r}
                onChange={setR}
                color="r"
              />
              <RGBSlider
                label="Green"
                value={g}
                onChange={setG}
                color="g"
              />
              <RGBSlider
                label="Blue"
                value={b}
                onChange={setB}
                color="b"
              />
            </div>
          </div>

          {/* 가중치 및 휘도 계산 */}
          <div
            className={cn(
              /* layout */
              "p-4 rounded-xl",
              /* background */
              "bg-white dark:bg-zinc-950",
              /* border */
              "border border-zinc-200 dark:border-zinc-800"
            )}
          >
            <LuminanceWeightVisualization r={r} g={g} b={b} />
          </div>
        </div>

        {/* 오른쪽: 결과 */}
        <div
          className={cn(
            /* layout */
            "space-y-6"
          )}
        >
          {/* 원본 색상 */}
          <div
            className={cn(
              /* layout */
              "p-4 rounded-xl",
              /* background */
              "bg-white dark:bg-zinc-950",
              /* border */
              "border border-zinc-200 dark:border-zinc-800",
              /* spacing */
              "space-y-3"
            )}
          >
            <h4
              className={cn(
                /* typography */
                "text-sm font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              원본 색상
            </h4>
            <div
              className={cn(
                /* layout */
                "flex items-center gap-4"
              )}
            >
              <div
                className={cn(
                  /* layout */
                  "w-20 h-20 rounded-lg",
                  /* border */
                  "border-2 border-zinc-300 dark:border-zinc-700"
                )}
                style={{ backgroundColor: colorHex }}
              />
              <div
                className={cn(
                  /* layout */
                  "flex-1 space-y-1"
                )}
              >
                <div
                  className={cn(
                    /* typography */
                    "text-xs font-mono",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  RGB({r}, {g}, {b})
                </div>
                <div
                  className={cn(
                    /* typography */
                    "text-xs font-mono",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {colorHex}
                </div>
                <div
                  className={cn(
                    /* typography */
                    "text-sm font-semibold",
                    /* color */
                    "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  휘도: {luminance.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* 휘도 기반 반전 결과 */}
          <div
            className={cn(
              /* layout */
              "p-4 rounded-xl",
              /* background */
              "bg-white dark:bg-zinc-950",
              /* border */
              "border border-zinc-200 dark:border-zinc-800",
              /* spacing */
              "space-y-3"
            )}
          >
            <h4
              className={cn(
                /* typography */
                "text-sm font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              휘도 기반 반전 결과
            </h4>
            <div
              className={cn(
                /* layout */
                "flex items-center gap-4"
              )}
            >
              <div
                className={cn(
                  /* layout */
                  "w-20 h-20 rounded-lg",
                  /* border */
                  "border-2 border-zinc-300 dark:border-zinc-700"
                )}
                style={{ backgroundColor: invertedColorHex }}
              />
              <div
                className={cn(
                  /* layout */
                  "flex-1 space-y-1"
                )}
              >
                <div
                  className={cn(
                    /* typography */
                    "text-xs font-mono",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  RGB({rInverted}, {gInverted}, {bInverted})
                </div>
                <div
                  className={cn(
                    /* typography */
                    "text-xs font-mono",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {invertedColorHex}
                </div>
                <div
                  className={cn(
                    /* typography */
                    "text-sm font-semibold",
                    /* color */
                    "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  휘도: {luminanceInverted.toFixed(4)}
                </div>
                <div
                  className={cn(
                    /* typography */
                    "text-xs",
                    /* color */
                    "text-zinc-500 dark:text-zinc-500"
                  )}
                >
                  (원본: {luminance.toFixed(4)} → 반전: {luminanceInverted.toFixed(4)})
                </div>
              </div>
            </div>
          </div>

          {/* 공식 설명 */}
          <div
            className={cn(
              /* layout */
              "p-4 rounded-xl",
              /* background */
              "bg-zinc-100 dark:bg-zinc-800/50",
              /* border */
              "border border-zinc-200 dark:border-zinc-800",
              /* spacing */
              "space-y-2"
            )}
          >
            <div
              className={cn(
                /* typography */
                "text-xs font-semibold",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              휘도 계산 공식
            </div>
            <div
              className={cn(
                /* typography */
                "text-xs font-mono",
                /* color */
                "text-zinc-600 dark:text-zinc-400"
              )}
            >
              Y = 0.2126·R + 0.7152·G + 0.0722·B
            </div>
            <div
              className={cn(
                /* typography */
                "text-xs font-semibold mt-3",
                /* color */
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              휘도 기반 반전 공식
            </div>
            <div
              className={cn(
                /* typography */
                "text-xs font-mono",
                /* color */
                "text-zinc-600 dark:text-zinc-400"
              )}
            >
              RGB' = RGB + (1 - 2Y) · [1, 1, 1]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
