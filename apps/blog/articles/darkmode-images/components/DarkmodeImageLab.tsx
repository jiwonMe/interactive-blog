"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "../../../lib/utils";
import { SVGFilteredImage } from "../../../components/mdx-components/SVGFilteredImage";

type TransformMethod = "original" | "invert" | "invert-hue-180";

const METHOD_OPTIONS: { value: TransformMethod; label: string; description: string }[] = [
  { value: "original", label: "원본", description: "변환 없음" },
  { value: "invert", label: "invert", description: "단순 반전 (색상도 반전)" },
  { value: "invert-hue-180", label: "invert + hueRotate", description: "색상 유지 변환" },
];

const IMAGE_OPTIONS = [
  {
    value: "sea-surface-temperature",
    label: "해수면 온도 지도",
    src: "/images/articles/darkmode-images/images/sea-surface-temperature.jpg",
    width: 1440,
    height: 720,
  },
  {
    value: "la-nina",
    label: "라니냐 다이어그램",
    src: "/images/articles/darkmode-images/images/la-nina.png",
    width: 696,
    height: 624,
  },
  {
    value: "proton-proton-chain",
    label: "양성자-양성자 연쇄 반응",
    src: "/images/articles/darkmode-images/images/proton-proton-chain.png",
    width: 960,
    height: 1117,
  },
  {
    value: "atmosphere-composition",
    label: "대기 구성 다이어그램",
    src: "/images/articles/darkmode-images/images/atmosphere-composition.png",
    width: 1280,
    height: 986,
  },
  {
    value: "active-margin",
    label: "활성 대륙 경계",
    src: "/images/articles/darkmode-images/images/active-margin.png",
    width: 2560,
    height: 1488,
  },
] as const;

export interface DarkmodeImageLabProps {
  defaultImage?: string;
}

export function DarkmodeImageLab({
  defaultImage = "sea-surface-temperature",
}: DarkmodeImageLabProps) {
  const [selectedImage, setSelectedImage] = React.useState(defaultImage);
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;
  const { src, width, height } = imageOption;
  const alt = imageOption.label;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [method, setMethod] = React.useState<TransformMethod>("original");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const renderImage = () => {
    switch (method) {
      case "original":
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
      case "invert":
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
      case "invert-hue-180":
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
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          /* layout */
          "w-full rounded-2xl p-6",
          /* background */
          "bg-zinc-50 dark:bg-zinc-900",
          /* border */
          "border border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div className="h-[400px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        /* layout */
        "w-full rounded-2xl p-6",
        /* background */
        "bg-zinc-50 dark:bg-zinc-900",
        /* border */
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          /* layout */
          "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <div>
          <h3
            className={cn(
              /* typography */
              "text-lg font-bold",
              /* color */
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            다크모드 이미지 실험실
          </h3>
          <p
            className={cn(
              /* typography */
              "mt-1 text-sm",
              /* color */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            방법을 선택하고 테마를 전환해 결과를 비교해보세요
          </p>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className={cn(
            /* layout */
            "flex items-center gap-2 rounded-lg px-4 py-2",
            /* background */
            "bg-white dark:bg-zinc-800",
            /* border */
            "border border-zinc-200 dark:border-zinc-700",
            /* interaction */
            "transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
          )}
        >
          <span
            className={cn(
              /* typography */
              "text-sm font-medium",
              /* color */
              "text-zinc-700 dark:text-zinc-300"
            )}
          >
            {isDark ? "🌙 다크" : "☀️ 라이트"}
          </span>
        </button>
      </div>

      {/* Image Selector */}
      <div
        className={cn(
          /* layout */
          "mb-4 flex flex-wrap gap-2"
        )}
      >
        <span
          className={cn(
            /* typography */
            "self-center text-sm",
            /* color */
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          이미지:
        </span>
        {IMAGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedImage(option.value)}
            className={cn(
              /* layout */
              "rounded-lg px-3 py-1.5",
              /* border */
              "border transition-colors",
              /* state: selected */
              selectedImage === option.value
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600",
              /* typography */
              "text-sm font-medium"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Method Selector */}
      <div
        className={cn(
          /* layout */
          "mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3"
        )}
      >
        {METHOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setMethod(option.value)}
            className={cn(
              /* layout */
              "flex flex-col items-start rounded-lg p-3",
              /* border */
              "border-2 transition-colors",
              /* state: selected */
              method === option.value
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            )}
          >
            <span
              className={cn(
                /* typography */
                "text-sm font-medium",
                /* color */
                method === option.value
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-zinc-900 dark:text-zinc-100"
              )}
            >
              {option.label}
            </span>
            <span
              className={cn(
                /* typography */
                "mt-0.5 text-xs",
                /* color */
                "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {option.description}
            </span>
          </button>
        ))}
      </div>

      {/* Image Preview */}
      <div
        className={cn(
          /* layout */
          "overflow-hidden rounded-xl",
          /* background */
          "bg-white dark:bg-zinc-950"
        )}
      >
        {renderImage()}
      </div>

      {/* Info Badge */}
      <div
        className={cn(
          /* layout */
          "mt-4 flex items-center justify-center gap-2"
        )}
      >
        <span
          className={cn(
            /* layout */
            "inline-flex items-center rounded-full px-3 py-1",
            /* background */
            isDark ? "bg-zinc-800" : "bg-zinc-100",
            /* typography */
            "text-xs font-medium",
            /* color */
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          현재 테마: {isDark ? "다크" : "라이트"}
          {method !== "original" && isDark && " → 변환 적용됨"}
          {method !== "original" && !isDark && " → 변환 미적용 (원본)"}
        </span>
      </div>
    </div>
  );
}
