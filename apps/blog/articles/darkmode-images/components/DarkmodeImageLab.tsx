"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "../../../lib/utils";
import { SVGFilteredImage } from "../../../components/mdx-components/SVGFilteredImage";
import { ImageSelector } from "./ImageSelector";
import { type ImageInfo } from "./useImageUpload";

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
  const [customImage, setCustomImage] = React.useState<ImageInfo | null>(null);
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;
  
  // 커스텀 이미지가 있으면 그것을 사용, 없으면 기본 이미지 사용
  const src = customImage?.src ?? imageOption.src;
  const width = customImage?.width ?? imageOption.width;
  const height = customImage?.height ?? imageOption.height;
  const alt = customImage?.alt ?? imageOption.label;
  
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
          "w-full rounded-2xl",
          "px-3 py-4",
          "sm:px-4 sm:py-5",
          "md:p-6",
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
        "w-full rounded-2xl",
        "px-3 py-4",
        "sm:px-4 sm:py-5",
        "md:p-6",
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
              "text-lg font-semibold",
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
            변환 방법을 선택하고 라이트/다크 테마를 전환하며 결과를 비교해보세요
          </p>
        </div>

        {/* Theme Toggle - 라이트 모드일 때만 표시 */}
        {!isDark && (
          <button
            onClick={handleThemeToggle}
            className={cn(
              /* layout */
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5",
              /* border */
              "border border-zinc-200",
              /* background */
              "bg-white",
              /* interaction */
              "transition-colors hover:bg-zinc-100",
              /* focus */
              "focus:outline-none focus:ring-2 focus:ring-zinc-400/40",
              /* typography */
              "text-sm font-medium",
              /* color */
              "text-zinc-700"
            )}
            aria-label="다크모드로 전환하기"
          >
            <Moon
              className={cn(
                /* layout */
                "h-4 w-4",
                /* color */
                "text-zinc-700"
              )}
            />
            <span>다크모드로 전환하기</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div
        className={cn(
          /* layout */
          "mb-6 flex flex-col gap-4"
        )}
      >
        {/* Image Selector */}
        <ImageSelector
          options={IMAGE_OPTIONS}
          selectedValue={selectedImage}
          onValueChange={(value) => {
            setSelectedImage(value);
            setCustomImage(null);
          }}
          onImageSelect={setCustomImage}
        />

        {/* Method Tabs */}
        <div>
          <label
            className={cn(
              /* typography */
              "mb-2 block text-xs font-medium",
              /* color */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            변환 방법
          </label>
          <div
            className={cn(
              /* layout */
              "inline-flex items-center gap-1 rounded-lg p-1",
              /* background */
              "bg-zinc-100 dark:bg-zinc-800"
            )}
            role="tablist"
          >
            {METHOD_OPTIONS.map((option) => {
              const isActive = method === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setMethod(option.value)}
                  className={cn(
                    /* layout */
                    "flex flex-col items-start rounded-md px-3 py-2",
                    /* typography */
                    "text-xs font-medium",
                    /* transition */
                    "transition-colors",
                    /* active/inactive */
                    isActive
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/60",
                    /* focus */
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-500/40"
                  )}
                >
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      /* typography */
                      "mt-0.5 text-[10px]",
                      /* color */
                      isActive
                        ? "text-zinc-600 dark:text-zinc-400"
                        : "text-zinc-500 dark:text-zinc-500"
                    )}
                  >
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
          "mt-4 flex items-center justify-center"
        )}
      >
        <span
          className={cn(
            /* layout */
            "inline-flex items-center rounded-full px-3 py-1",
            /* background */
            "bg-zinc-100 dark:bg-zinc-800",
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
