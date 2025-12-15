import React from "react";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";
import { ThemeToggle } from "../../../../components/theme-toggle";
import { DarkmodeImage } from "../../../../components/mdx-components/DarkmodeImage";

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

function DarkmodeImageDemo(props: {
  srcMode: string;
  randomSeed: number;
  src: string;
  lightPreset: string;
  caption: string;
}) {
  const finalSrc = props.srcMode === "random" ? pickFromPoolBySeed(props.randomSeed) : props.src;

  const lightPreset =
    props.lightPreset === "none" ||
    props.lightPreset === "blur" ||
    props.lightPreset === "noise" ||
    props.lightPreset === "duotone"
      ? (props.lightPreset as "none" | "blur" | "noise" | "duotone")
      : "none";

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
            DarkmodeImage
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
            다크모드일 때만 <code>preset=&quot;invert-hue-180&quot;</code> (hueRotate 180 + invert 100%)가
            적용됩니다. 오른쪽 토글로 테마를 바꿔보세요.
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
        <DarkmodeImage
          src={finalSrc}
          alt="DarkmodeImage demo"
          width={1200}
          height={630}
          lightPreset={lightPreset}
          caption={props.caption}
        />
      </div>
    </div>
  );
}

export const blogMdxDarkmodeImageStories: ExperimentStory[] = [
  {
    slug: "blog-mdx/darkmode-image",
    title: "DarkmodeImage",
    description: "다크모드일 때만 hue rotate 180 + invert 100% preset을 적용하는 이미지 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "image", "darkmode"],
    sourcePaths: [
      "apps/blog/components/mdx-components/DarkmodeImage.tsx",
      "apps/blog/components/mdx-components/SVGFilteredImage.tsx",
    ],
    render: (props) => <DarkmodeImageDemo {...props} />,
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
      lightPreset: {
        type: "select",
        label: "Light preset (라이트모드)",
        defaultValue: "none",
        options: ["none", "blur", "noise", "duotone"],
      },
      caption: { type: "text", label: "caption (빈 값이면 숨김)", defaultValue: "다크모드에서만 반전+색상회전" },
    },
  },
];


