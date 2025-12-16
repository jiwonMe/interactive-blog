"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { ImageComparisonSlider } from "./ImageComparisonSlider";

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

export interface DualImageComparisonProps {
  defaultImage?: string;
}

export function DualImageComparison({ defaultImage = "sea-surface-temperature" }: DualImageComparisonProps) {
  const [selectedImage, setSelectedImage] = React.useState(defaultImage);
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;

  return (
    <div className="space-y-6">
      {/* Image selector */}
      <div
        className={cn(
          /* layout */
          "flex items-center justify-center gap-3 rounded-xl p-4",
          /* background */
          "bg-zinc-100 dark:bg-zinc-800"
        )}
      >
        <label
          htmlFor="dual-image-select"
          className={cn(
            /* typography */
            "text-sm font-medium",
            /* color */
            "text-zinc-700 dark:text-zinc-300"
          )}
        >
          이미지 선택:
        </label>
        <select
          id="dual-image-select"
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.value)}
          className={cn(
            /* typography */
            "text-sm font-medium",
            /* shape */
            "rounded-lg px-4 py-2",
            /* background */
            "bg-white dark:bg-zinc-900",
            /* border */
            "border border-zinc-300 dark:border-zinc-600",
            /* color */
            "text-zinc-900 dark:text-zinc-100",
            /* interaction */
            "cursor-pointer transition-colors hover:border-zinc-400 dark:hover:border-zinc-500"
          )}
        >
          {IMAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comparison sliders */}
      <ImageComparisonSlider
        src={imageOption.src}
        alt={imageOption.label}
        width={imageOption.width}
        height={imageOption.height}
        leftMethod="original"
        rightMethod="invert"
        label="원본 vs invert (색상이 보색으로 바뀜)"
        hideImageSelector
      />

      <ImageComparisonSlider
        src={imageOption.src}
        alt={imageOption.label}
        width={imageOption.width}
        height={imageOption.height}
        leftMethod="original"
        rightMethod="invert-hue-180"
        label="원본 vs invert + hueRotate (색상 유지)"
        hideImageSelector
      />
    </div>
  );
}
