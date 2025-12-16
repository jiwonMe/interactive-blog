"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { ImageComparisonSlider } from "./ImageComparisonSlider";
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

export interface DualImageComparisonProps {
  defaultImage?: string;
}

export function DualImageComparison({ defaultImage = "la-nina" }: DualImageComparisonProps) {
  const [selectedImage, setSelectedImage] = React.useState(defaultImage);
  const [customImage, setCustomImage] = React.useState<ImageInfo | null>(null);
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;

  // 커스텀 이미지가 있으면 그것을 사용, 없으면 기본 이미지 사용
  const src = customImage?.src ?? imageOption.src;
  const width = customImage?.width ?? imageOption.width;
  const height = customImage?.height ?? imageOption.height;
  const alt = customImage?.alt ?? imageOption.label;

  return (
    <div
      className={cn(
        /* layout */
        "space-y-6"
      )}
    >
      {/* Image selector */}
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
        <ImageSelector
          options={IMAGE_OPTIONS}
          selectedValue={selectedImage}
          onValueChange={(value) => {
            setSelectedImage(value);
            setCustomImage(null);
          }}
          onImageSelect={setCustomImage}
        />
      </div>

      {/* Comparison sliders */}
      <ImageComparisonSlider
        src={src}
        alt={alt}
        width={width}
        height={height}
        leftMethod="original"
        rightMethod="invert"
        label="원본 vs invert"
        description="색상이 보색으로 바뀜"
        hideImageSelector
      />

      <ImageComparisonSlider
        src={src}
        alt={alt}
        width={width}
        height={height}
        leftMethod="original"
        rightMethod="invert-hue-180"
        label="원본 vs invert + hueRotate"
        description="색상 유지"
        hideImageSelector
      />
    </div>
  );
}

