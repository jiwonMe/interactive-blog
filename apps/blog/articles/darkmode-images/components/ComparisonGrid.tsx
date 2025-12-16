"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "../../../lib/utils";
import { SVGFilteredImage } from "../../../components/mdx-components/SVGFilteredImage";
import { DarkmodeOklchImage } from "../../../components/mdx-components/DarkmodeOklchImage";

export interface ComparisonGridProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const DEFAULT_SRC = "/images/articles/darkmode-images/images/sea-surface-temperature.jpg";
const DEFAULT_ALT = "해수면 온도 지도 (2007년 11월)";
const DEFAULT_WIDTH = 1440;
const DEFAULT_HEIGHT = 720;

const METHODS = [
  { key: "original", label: "원본", description: "변환 없음" },
  { key: "invert", label: "invert(1)", description: "단순 반전" },
  { key: "invert-hue-180", label: "invert + hueRotate", description: "색상 유지" },
] as const;

export function ComparisonGrid({
  src = DEFAULT_SRC,
  alt = DEFAULT_ALT,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: ComparisonGridProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  const renderImage = (method: (typeof METHODS)[number]["key"]) => {
    if (method === "original") {
      return (
        <SVGFilteredImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          preset="none"
          wrapperClassName="my-0"
        />
      );
    }

    if (method === "invert") {
      return (
        <SVGFilteredImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          preset={isDark ? "invert" : "none"}
          wrapperClassName="my-0"
        />
      );
    }

    if (method === "invert-hue-180") {
      return (
        <SVGFilteredImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          preset={isDark ? "invert-hue-180" : "none"}
          wrapperClassName="my-0"
        />
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        /* layout */
        "rounded-2xl p-4",
        /* background */
        "bg-zinc-50 dark:bg-zinc-900",
        /* border */
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* layout */
          "mb-4 flex items-center justify-between"
        )}
      >
        <p
          className={cn(
            /* typography */
            "text-sm font-medium",
            /* color */
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          현재 테마: {isDark ? "🌙 다크" : "☀️ 라이트"}
          {isDark ? " (변환 적용됨)" : " (원본 표시)"}
        </p>
      </div>

      <div
        className={cn(
          /* layout */
          "grid grid-cols-1 gap-4 sm:grid-cols-2"
        )}
      >
        {METHODS.map((method) => (
          <div key={method.key}>
            <div
              className={cn(
                /* layout */
                "mb-2 flex items-baseline gap-2"
              )}
            >
              <span
                className={cn(
                  /* typography */
                  "text-sm font-semibold",
                  /* color */
                  "text-zinc-900 dark:text-zinc-100"
                )}
              >
                {method.label}
              </span>
              <span
                className={cn(
                  /* typography */
                  "text-xs",
                  /* color */
                  "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {method.description}
              </span>
            </div>
            {renderImage(method.key)}
          </div>
        ))}
      </div>
    </div>
  );
}
