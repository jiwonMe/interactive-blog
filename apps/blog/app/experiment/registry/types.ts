import type React from "react";

export type ControlType =
  | { type: "text"; label: string; defaultValue: string }
  | {
      type: "number";
      label: string;
      defaultValue: number;
      min?: number;
      max?: number;
      step?: number;
    }
  | { type: "boolean"; label: string; defaultValue: boolean }
  | {
      type: "select";
      label: string;
      defaultValue: string;
      options: string[];
    };

export type StoryLink = {
  href: string;
  label: string;
};

export type StorySnippet = {
  label: string;
  getCode: (defaults: Record<string, any>) => string;
};

export type ExperimentStory = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  links?: StoryLink[];
  snippets?: StorySnippet[];
  /**
   * 코드/컴포넌트 원본 경로 (리포지토리 내부 경로)
   * - Storybook의 "source" 역할
   */
  sourcePaths?: string[];
  render: (props: any) => React.ReactNode;
  controls: Record<string, ControlType>;
};

