"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "../../../lib/utils";
import { SVGFilteredImage } from "../../../components/mdx-components/SVGFilteredImage";
import { ImageSelector } from "./ImageSelector";
import { type ImageInfo } from "./useImageUpload";

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
    value: "em-spectrum",
    label: "전자기 스펙트럼",
    src: "/images/articles/darkmode-images/images/em-spectrum.png",
    width: 1440,
    height: 720,
  },
  {
    value: "naver-map",
    label: "네이버 지도",
    src: "/images/articles/darkmode-images/images/naver-map.png",
    width: 1440,
    height: 720,
  },
] as const;

export interface ImageComparisonSliderProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  leftMethod: "original" | "invert" | "invert-hue-180";
  rightMethod: "original" | "invert" | "invert-hue-180";
  label?: string;
  description?: string;
  defaultImage?: string;
  hideImageSelector?: boolean;
}

const METHOD_LABELS = {
  original: "원본",
  invert: "invert(1)",
  "invert-hue-180": "invert + hueRotate",
} as const;

export function ImageComparisonSlider({
  src: propSrc,
  alt: propAlt,
  width: propWidth,
  height: propHeight,
  leftMethod,
  rightMethod,
  label,
  description,
  defaultImage = "la-nina",
  hideImageSelector = false,
}: ImageComparisonSliderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(defaultImage);
  const [customImage, setCustomImage] = React.useState<ImageInfo | null>(null);
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Use props if provided, otherwise use selected image or custom image
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;
  const src = propSrc ?? customImage?.src ?? imageOption.src;
  const alt = propAlt ?? customImage?.alt ?? imageOption.label;
  const width = propWidth ?? customImage?.width ?? imageOption.width;
  const height = propHeight ?? customImage?.height ?? imageOption.height;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchMove = React.useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleTouchEnd = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const renderImage = (method: typeof leftMethod | typeof rightMethod) => {
    const preset = method === "original" ? "none" : method;

    return (
      <SVGFilteredImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        preset={isDark ? preset : "none"}
        wrapperClassName="my-0"
      />
    );
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          /* layout */
          "relative aspect-video w-full overflow-hidden rounded-xl",
          /* background */
          "animate-pulse bg-zinc-200 dark:bg-zinc-800"
        )}
      />
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
      {/* Header with label and optional image selector */}
      {(label || !hideImageSelector) && (
        <div
          className={cn(
            /* layout */
            "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          {label && (
            <div>
              <p
                className={cn(
                  /* typography */
                  "text-sm font-semibold",
                  /* color */
                  "text-zinc-900 dark:text-zinc-100"
                )}
              >
                {label}
              </p>
              {description && (
                <p
                  className={cn(
                    /* typography */
                    "mt-0.5 text-xs",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          {!hideImageSelector && (
            <div
              className={cn(
                /* layout */
                "w-full max-w-xs"
              )}
            >
              <ImageSelector
                options={IMAGE_OPTIONS}
                selectedValue={selectedImage}
                onValueChange={(value) => {
                  setSelectedImage(value);
                  setCustomImage(null);
                }}
                onImageSelect={setCustomImage}
                label="이미지"
              />
            </div>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          /* layout */
          "relative w-full overflow-hidden rounded-xl",
          /* cursor */
          isDragging ? "cursor-grabbing" : "cursor-grab",
          /* border */
          "border border-zinc-200 dark:border-zinc-800"
        )}
        style={{
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {/* Right image (full) */}
        <div className="absolute inset-0">{renderImage(rightMethod)}</div>

        {/* Left image (clipped) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          {renderImage(leftMethod)}
        </div>

        {/* Slider line */}
        <div
          className={cn(
            /* layout */
            "absolute top-0 bottom-0 w-0.5",
            /* background */
            "bg-white shadow-lg",
            /* z-index */
            "z-10"
          )}
          style={{
            left: `${sliderPosition}%`,
          }}
        >
          {/* Slider handle */}
          <div
            className={cn(
              /* layout */
              "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2",
              /* shape */
              "rounded-full",
              /* background */
              "bg-white shadow-xl",
              /* border */
              "border-2 border-zinc-300 dark:border-zinc-600",
              /* cursor */
              "cursor-grab active:cursor-grabbing",
              /* interaction */
              "touch-none"
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Arrow icons */}
            <div
              className={cn(
                /* layout */
                "flex h-full w-full items-center justify-center gap-0.5"
              )}
            >
              <svg
                className={cn(
                  /* size */
                  "h-3 w-3",
                  /* color */
                  "text-zinc-600"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <svg
                className={cn(
                  /* size */
                  "h-3 w-3",
                  /* color */
                  "text-zinc-600"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div
          className={cn(
            /* layout */
            "absolute left-4 top-4",
            /* background */
            "rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md",
            /* border */
            "border border-white/10",
            /* z-index */
            "z-20"
          )}
        >
          <p
            className={cn(
              /* typography */
              "text-xs font-semibold",
              /* color */
              "text-white"
            )}
          >
            {METHOD_LABELS[leftMethod]}
          </p>
        </div>
        <div
          className={cn(
            /* layout */
            "absolute right-4 top-4",
            /* background */
            "rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md",
            /* border */
            "border border-white/10",
            /* z-index */
            "z-20"
          )}
        >
          <p
            className={cn(
              /* typography */
              "text-xs font-semibold",
              /* color */
              "text-white"
            )}
          >
            {METHOD_LABELS[rightMethod]}
          </p>
        </div>
      </div>

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
          드래그하거나 터치해서 비교해보세요
        </span>
      </div>
    </div>
  );
}

