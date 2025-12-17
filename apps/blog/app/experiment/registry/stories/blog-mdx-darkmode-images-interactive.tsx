import React from "react";
import type { ExperimentStory } from "../types";
import { DarkmodeImageLab } from "../../../../articles/darkmode-images/components/DarkmodeImageLab";
import { DualImageComparison } from "../../../../articles/darkmode-images/components/DualImageComparison";
import { FeColorMatrixLab } from "../../../../articles/darkmode-images/components/FeColorMatrixLab";
import { LuminanceVisualization } from "../../../../articles/darkmode-images/components/LuminanceVisualization";

export const blogMdxDarkmodeImagesInteractiveStories: ExperimentStory[] = [
  {
    slug: "articles/darkmode-image/darkmode-image-lab",
    title: "DarkmodeImageLab",
    description: "다크모드에서 이미지를 반전하는 다양한 방법을 비교해볼 수 있는 실험실입니다. 원본, invert, invert+hueRotate를 비교할 수 있습니다.",
    category: "Articles / darkmode-image",
    tags: ["blog", "mdx", "darkmode", "image", "filter", "svg"],
    sourcePaths: [
      "apps/blog/articles/darkmode-images/components/DarkmodeImageLab.tsx",
      "apps/blog/components/mdx-components/SVGFilteredImage.tsx",
    ],
    render: (props: any) => (
      <DarkmodeImageLab defaultImage={props.defaultImage} />
    ),
    controls: {
      defaultImage: {
        type: "select",
        label: "기본 이미지",
        defaultValue: "la-nina",
        options: ["sea-surface-temperature", "la-nina", "em-spectrum", "naver-map"],
      },
    },
  },
  {
    slug: "articles/darkmode-image/dual-image-comparison",
    title: "DualImageComparison",
    description: "원본 vs invert, 원본 vs invert+hueRotate를 슬라이더로 비교할 수 있는 컴포넌트입니다.",
    category: "Articles / darkmode-image",
    tags: ["blog", "mdx", "darkmode", "image", "filter", "comparison"],
    sourcePaths: [
      "apps/blog/articles/darkmode-images/components/DualImageComparison.tsx",
      "apps/blog/articles/darkmode-images/components/ImageComparisonSlider.tsx",
    ],
    render: (props: any) => (
      <DualImageComparison defaultImage={props.defaultImage} />
    ),
    controls: {
      defaultImage: {
        type: "select",
        label: "기본 이미지",
        defaultValue: "la-nina",
        options: ["sea-surface-temperature", "la-nina", "em-spectrum", "naver-map"],
      },
    },
  },
  {
    slug: "articles/darkmode-image/fe-color-matrix-lab",
    title: "FeColorMatrixLab",
    description: "SVG feColorMatrix의 4×5 행렬 값을 직접 조정하여 이미지 필터 효과를 실시간으로 확인할 수 있는 플레이그라운드입니다.",
    category: "Articles / darkmode-image",
    tags: ["blog", "mdx", "darkmode", "image", "svg", "filter", "feColorMatrix"],
    sourcePaths: [
      "apps/blog/articles/darkmode-images/components/FeColorMatrixLab.tsx",
      "apps/blog/articles/darkmode-images/components/FeColorMatrixMatrixEditor.tsx",
      "apps/blog/articles/darkmode-images/components/FeColorMatrixValuesEditor.tsx",
    ],
    render: (props: any) => (
      <FeColorMatrixLab defaultImage={props.defaultImage} defaultPreset={props.defaultPreset} />
    ),
    controls: {
      defaultImage: {
        type: "select",
        label: "기본 이미지",
        defaultValue: "la-nina",
        options: ["sea-surface-temperature", "la-nina", "em-spectrum", "naver-map"],
      },
      defaultPreset: {
        type: "select",
        label: "기본 preset",
        defaultValue: "identity",
        options: ["identity", "invert", "invert-hue-180", "luma-invert"],
      },
    },
  },
  {
    slug: "articles/darkmode-image/luminance-visualization",
    title: "LuminanceVisualization",
    description: "RGB 값을 조절하여 휘도(luminance) 계산과 휘도 기반 반전이 어떻게 작동하는지 시각적으로 확인할 수 있는 컴포넌트입니다.",
    category: "Articles / darkmode-image",
    tags: ["blog", "mdx", "darkmode", "luminance", "color", "rgb"],
    sourcePaths: [
      "apps/blog/articles/darkmode-images/components/LuminanceVisualization.tsx",
      "apps/blog/articles/darkmode-images/components/RGBSlider.tsx",
      "apps/blog/articles/darkmode-images/components/LuminanceWeightVisualization.tsx",
    ],
    render: (props: any) => (
      <LuminanceVisualization defaultR={props.defaultR} defaultG={props.defaultG} defaultB={props.defaultB} />
    ),
    controls: {
      defaultR: {
        type: "number",
        label: "기본 Red 값",
        defaultValue: 255,
        min: 0,
        max: 255,
        step: 1,
      },
      defaultG: {
        type: "number",
        label: "기본 Green 값",
        defaultValue: 100,
        min: 0,
        max: 255,
        step: 1,
      },
      defaultB: {
        type: "number",
        label: "기본 Blue 값",
        defaultValue: 50,
        min: 0,
        max: 255,
        step: 1,
      },
    },
  },
];
