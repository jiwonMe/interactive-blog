import React from "react";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";
import { ThemeToggle } from "../../../../components/theme-toggle";
import { DarkmodeOklchImage } from "../../../../components/mdx-components/DarkmodeOklchImage";

const EXPERIMENT_IMAGE_POOL = [
  "/images/og-default.png",
  "/images/articles/shuffle-bias/images/og-image.png",
  "/images/articles/shuffle-bias/images/shuffle-image.png",
  "/images/articles/text-editor-data-structures/images/og-image.png",
  "/images/articles/v8-array-internals/images/og-image.png",
  "/images/articles/v8-map-internals/images/og-image.png",
  "/images/articles/v8-map-internals/images/memory-layout.webp",
  "/images/articles/v8-math-random/images/og-image.png",
  "/images/articles/v8-object-vs-map/images/og-image.png",
] as const;

function pickFromPoolBySeed(seed: number) {
  const safeSeed = Number.isFinite(seed) ? seed : 0;
  const idx = Math.abs(Math.floor(safeSeed)) % EXPERIMENT_IMAGE_POOL.length;
  return EXPERIMENT_IMAGE_POOL[idx] ?? "/images/og-default.png";
}

function DarkmodeOklchImageDemo(props: {
  srcMode: string;
  randomSeed: number;
  src: string;
  maxProcessingPixels: number;
  bisectionSteps: number;
  caption: string;
}) {
  const finalSrc = props.srcMode === "random" ? pickFromPoolBySeed(props.randomSeed) : props.src;

  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-3xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* 레이아웃 */
          "flex items-start justify-between gap-4"
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              /* 타이포 */
              "text-lg font-bold",
              /* 색상 */
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            DarkmodeOklchImage (canvas)
          </h3>
          <p
            className={cn(
              /* 레이아웃 */
              "mt-2",
              /* 타이포 */
              "text-sm leading-relaxed",
              /* 색상 */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            다크모드에서만 OKLCH로 변환하여 <code>L&apos; = 1 - L</code>을 적용하고, out-of-gamut면
            chroma(C)를 bisection으로 줄여 sRGB gamut 안으로 넣습니다.
          </p>
        </div>

        <ThemeToggle />
      </div>

      <div
        className={cn(
          /* 레이아웃 */
          "mt-6"
        )}
      >
        <DarkmodeOklchImage
          src={finalSrc}
          alt="DarkmodeOklchImage demo"
          width={1200}
          height={630}
          maxProcessingPixels={props.maxProcessingPixels}
          bisectionSteps={props.bisectionSteps}
          caption={props.caption}
        />
      </div>
    </div>
  );
}

export const blogMdxDarkmodeOklchImageStories: ExperimentStory[] = [
  {
    slug: "blog-mdx/darkmode-oklch-image",
    title: "DarkmodeOklchImage (canvas)",
    description: "OKLCH 기반 밝기 반전 + gamut 매핑(bisection) 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "image", "darkmode", "oklch", "canvas"],
    sourcePaths: [
      "apps/blog/components/mdx-components/DarkmodeOklchImage.tsx",
      "apps/blog/lib/oklch-invert.ts",
    ],
    render: (props) => <DarkmodeOklchImageDemo {...props} />,
    controls: {
      srcMode: {
        type: "select",
        label: "이미지 소스",
        defaultValue: "random",
        options: ["random", "manual"],
      },
      randomSeed: {
        type: "number",
        label: "랜덤 seed (이미지 선택)",
        defaultValue: 0,
        min: 0,
        max: 500,
        step: 1,
      },
      src: { type: "text", label: "이미지 src (manual)", defaultValue: "/images/og-default.png" },
      maxProcessingPixels: {
        type: "number",
        label: "처리 픽셀 상한 (성능)",
        defaultValue: 260000,
        min: 40000,
        max: 900000,
        step: 10000,
      },
      bisectionSteps: {
        type: "number",
        label: "Bisection steps (C 줄이기)",
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 1,
      },
      caption: { type: "text", label: "caption (빈 값이면 숨김)", defaultValue: "OKLCH 기반 다크 변환" },
    },
  },
];


