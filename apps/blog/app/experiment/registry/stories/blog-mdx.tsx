import React from "react";
import { CodeBlock } from "@repo/interactive-ui";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";
import { CodeTab, CodeTabs } from "../../../../components/code-tabs";
import { CollapsibleSection } from "../../../../components/mdx-components/CollapsibleSection";
import {
  Boxed,
  Claim,
  Definition,
  Lemma,
  Proof,
  ProofStep,
  ProofSteps,
  Theorem,
} from "../../../../components/mdx-components/proof-components";
import { HeadingWithLink } from "../../../../components/mdx-components/heading-with-link";
import { SVGFilteredImage } from "../../../../components/mdx-components/SVGFilteredImage";

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

function MdxCollapsibleSectionDemo() {
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
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        CollapsibleSection (MDX 공통)
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
        기본은 접혀있고, 열림 상태를 sessionStorage로 유지합니다.
      </p>

      <CollapsibleSection title="더 깊게 보기(데모)" persist storage="session" storageKey="experiment:mdx:collapsible">
        <div
          className={cn(
            /* 레이아웃 */
            "space-y-3",
            /* 타이포 */
            "text-sm leading-relaxed",
            /* 색상 */
            "text-zinc-700 dark:text-zinc-300"
          )}
        >
          <p>
            이 영역은 본문 흐름을 끊지 않으면서, 선택적으로 추가 설명을 제공할 때 사용합니다.
          </p>
          <Boxed title="참고" variant="note">
            박스형 강조(노트/정리/증명 등)와 함께 중첩해서 쓰는 경우가 많습니다.
          </Boxed>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function MdxProofComponentsDemo() {
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
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        Proof Components (MDX 공통)
      </h3>

      <div className="mt-4 space-y-6">
        <Definition name="균일 분포">
          가능한 모든 결과가 같은 확률로 발생하는 분포.
        </Definition>

        <Theorem name="간단한 예시">
          두 개의 공정한 동전을 던지면 (HH, HT, TH, TT) 4가지가 각각 1/4 확률로 나온다.
        </Theorem>

        <Lemma name="보조정리 예시">
          독립 시행이면, 결합 확률은 곱으로 분해된다.
        </Lemma>

        <Claim name="주장 예시">
          위 정리의 결과는 동전이 공정하다는 가정에 의존한다.
        </Claim>

        <Proof>
          <ProofSteps>
            <ProofStep label="표본공간:">두 번 던지기 결과는 4가지다.</ProofStep>
            <ProofStep label="확률:">각 결과는 독립이고 공정하므로 1/2 × 1/2 = 1/4다.</ProofStep>
          </ProofSteps>
        </Proof>
      </div>
    </div>
  );
}

function MdxCodeTabsDemo() {
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
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        CodeTabs / CodeTab (MDX 공통)
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
        rehype 플러그인이 생성한 탭 UI를 로컬에서 재현합니다.
      </p>

      <CodeTabs>
        <CodeTab title="TypeScript">
          <CodeBlock>
            <code>
{`export function add(a: number, b: number) {
  return a + b;
}
`}
            </code>
          </CodeBlock>
        </CodeTab>
        <CodeTab title="Python">
          <CodeBlock>
            <code>
{`def add(a: int, b: int) -> int:
    return a + b
`}
            </code>
          </CodeBlock>
        </CodeTab>
      </CodeTabs>
    </div>
  );
}

function MdxHeadingWithLinkDemo() {
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
      <p
        className={cn(
          /* 타이포 */
          "text-sm leading-relaxed",
          /* 색상 */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        제목 오른쪽의 버튼(hover 시 표시)을 눌러 섹션 링크를 클립보드로 복사합니다.
      </p>

      <HeadingWithLink
        as="h2"
        id="experiment-heading-with-link"
        className={cn(
          /* 레이아웃 */
          "mt-4",
          /* 타이포 */
          "text-2xl font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        HeadingWithLink 데모
      </HeadingWithLink>
    </div>
  );
}

function MdxSvgFilteredImageDemo(props: {
  src: string;
  srcMode: string;
  randomSeed: number;
  mode: string;
  preset: string;
  customType: string;
  blurStdDeviation: number;
  turbulenceFrequency: number;
  turbulenceOctaves: number;
  displacementScale: number;
  enableColor: boolean;
  hueRotate: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  brightness: number;
  contrast: number;
  invert: number;
  caption: string;
}) {
  const isCustom = props.mode === "custom";
  const finalSrc =
    props.srcMode === "random"
      ? pickFromPoolBySeed(props.randomSeed)
      : props.src;

  const customPrimitives =
    props.customType === "blur" ? (
      <feGaussianBlur stdDeviation={props.blurStdDeviation} />
    ) : props.customType === "noise" ? (
      <>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={props.turbulenceFrequency}
          numOctaves={props.turbulenceOctaves}
          seed={2}
        />
        <feDisplacementMap in="SourceGraphic" scale={props.displacementScale} />
      </>
    ) : props.customType === "duotone" ? (
      <>
        <feColorMatrix
          type="matrix"
          values="
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0      0      0      1 0
          "
        />
        <feComponentTransfer>
          <feFuncR type="gamma" amplitude="1.0" exponent="0.9" offset="0.05" />
          <feFuncG type="gamma" amplitude="1.0" exponent="0.9" offset="0.02" />
          <feFuncB type="gamma" amplitude="1.0" exponent="0.9" offset="0.12" />
        </feComponentTransfer>
      </>
    ) : null;

  const preset =
    props.preset === "none" ||
    props.preset === "blur" ||
    props.preset === "noise" ||
    props.preset === "duotone"
      ? (props.preset as "none" | "blur" | "noise" | "duotone")
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
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        SVGFilteredImage (Experiment)
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
        CSS <code>filter: url(#id)</code>로 SVG <code>&lt;filter /&gt;</code>를 이미지 위에
        적용합니다. 아래 컨트롤로 preset/custom 및 파라미터를 바꿔보세요.
      </p>

      <div
        className={cn(
          /* 레이아웃 */
          "mt-6"
        )}
      >
        <SVGFilteredImage
          src={finalSrc}
          alt="SVGFilteredImage demo"
          width={1200}
          height={630}
          preset={isCustom ? "none" : preset}
          enableColor={props.enableColor}
          color={{
            hueRotate: props.hueRotate,
            saturate: props.saturate,
            grayscale: props.grayscale,
            sepia: props.sepia,
            brightness: props.brightness,
            contrast: props.contrast,
            invert: props.invert,
          }}
          caption={props.caption}
        >
          {isCustom ? customPrimitives : null}
        </SVGFilteredImage>
      </div>
    </div>
  );
}

export const blogMdxStories: ExperimentStory[] = [
  {
    slug: "blog-mdx/collapsible-section",
    title: "CollapsibleSection",
    description: "MDX에서 쓰는 접기/펼치기 섹션 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "collapsible"],
    sourcePaths: ["apps/blog/components/mdx-components/CollapsibleSection.tsx"],
    render: () => <MdxCollapsibleSectionDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/proof-components",
    title: "Proof Components (Boxed/Theorem/Proof...)",
    description: "정리/정의/증명/스텝 등 수학 구조화 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "math"],
    sourcePaths: ["apps/blog/components/mdx-components/proof-components.tsx"],
    render: () => <MdxProofComponentsDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/code-tabs",
    title: "CodeTabs",
    description: "rehype 기반 코드 탭 UI 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "code"],
    sourcePaths: ["apps/blog/components/code-tabs.tsx"],
    render: () => <MdxCodeTabsDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/heading-with-link",
    title: "HeadingWithLink",
    description: "섹션 링크 복사 버튼이 있는 heading 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "heading"],
    sourcePaths: ["apps/blog/components/mdx-components/heading-with-link.tsx"],
    render: () => <MdxHeadingWithLinkDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/svg-filtered-image",
    title: "SVGFilteredImage",
    description: "이미지 위에 SVG filter를 적용하는 MDX용 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "image", "svg", "filter"],
    sourcePaths: [
      "apps/blog/components/mdx-components/SVGFilteredImage.tsx",
      "apps/blog/components/mdx-components/base-components.tsx",
    ],
    render: (props) => <MdxSvgFilteredImageDemo {...props} />,
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
      mode: {
        type: "select",
        label: "모드",
        defaultValue: "preset",
        options: ["preset", "custom"],
      },
      preset: {
        type: "select",
        label: "Preset (mode=preset)",
        defaultValue: "noise",
        options: ["none", "blur", "noise", "duotone", "invert-hue-180"],
      },
      customType: {
        type: "select",
        label: "Custom 타입 (mode=custom)",
        defaultValue: "noise",
        options: ["blur", "noise", "duotone"],
      },
      blurStdDeviation: {
        type: "number",
        label: "Blur stdDeviation",
        defaultValue: 2,
        min: 0,
        max: 12,
        step: 0.25,
      },
      turbulenceFrequency: {
        type: "number",
        label: "Noise baseFrequency",
        defaultValue: 0.8,
        min: 0,
        max: 2,
        step: 0.05,
      },
      turbulenceOctaves: {
        type: "number",
        label: "Noise numOctaves",
        defaultValue: 2,
        min: 1,
        max: 6,
        step: 1,
      },
      displacementScale: {
        type: "number",
        label: "Noise displacement scale",
        defaultValue: 8,
        min: 0,
        max: 40,
        step: 1,
      },
      enableColor: { type: "boolean", label: "색상 필터 활성화", defaultValue: true },
      hueRotate: {
        type: "number",
        label: "Hue rotate (deg)",
        defaultValue: 0,
        min: -180,
        max: 180,
        step: 1,
      },
      saturate: {
        type: "number",
        label: "Saturate",
        defaultValue: 1,
        min: 0,
        max: 3,
        step: 0.05,
      },
      grayscale: {
        type: "number",
        label: "Grayscale (0~1)",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      sepia: {
        type: "number",
        label: "Sepia (0~1)",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      brightness: {
        type: "number",
        label: "Brightness",
        defaultValue: 1,
        min: 0,
        max: 2,
        step: 0.05,
      },
      contrast: {
        type: "number",
        label: "Contrast",
        defaultValue: 1,
        min: 0,
        max: 2,
        step: 0.05,
      },
      invert: {
        type: "number",
        label: "Invert (0~1)",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      caption: { type: "text", label: "caption (빈 값이면 숨김)", defaultValue: "SVG filter 데모" },
    },
  },
];

