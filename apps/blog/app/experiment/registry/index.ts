import type { ExperimentStory } from "./types";
import { articleStories } from "./stories/articles";
import { blogMdxStories } from "./stories/blog-mdx";
import { blogMdxDarkmodeImageStories } from "./stories/blog-mdx-darkmode-image";
import { blogMdxDarkmodeImagesInteractiveStories } from "./stories/blog-mdx-darkmode-images-interactive";
import { blogMdxDarkmodeOklchImageStories } from "./stories/blog-mdx-darkmode-oklch-image";
import { codeSandboxStories } from "./stories/codesandbox";
import { interactiveComponentsStories } from "./stories/interactive-components";
import { interactiveUiMdxStories } from "./stories/interactive-ui-mdx";
import { uiStories } from "./stories/ui";

export type { ControlType, ExperimentStory, StoryLink } from "./types";

export const experiments: ExperimentStory[] = [
  ...uiStories,
  ...interactiveUiMdxStories,
  ...codeSandboxStories,
  ...interactiveComponentsStories,
  ...blogMdxStories,
  ...blogMdxDarkmodeImageStories,
  ...blogMdxDarkmodeImagesInteractiveStories,
  ...blogMdxDarkmodeOklchImageStories,
  ...articleStories,
].sort(
  (a, b) => {
    const byCategory = a.category.localeCompare(b.category);
    if (byCategory !== 0) return byCategory;
    return a.title.localeCompare(b.title);
  }
);

export function getExperimentBySlug(slug: string) {
  return experiments.find((e) => e.slug === slug);
}

