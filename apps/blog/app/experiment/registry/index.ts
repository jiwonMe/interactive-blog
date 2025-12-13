import type { ExperimentStory } from "./types";
import { articleStories } from "./stories/articles";
import { blogMdxStories } from "./stories/blog-mdx";
import { interactiveUiMdxStories } from "./stories/interactive-ui-mdx";
import { uiStories } from "./stories/ui";

export type { ControlType, ExperimentStory, StoryLink } from "./types";

export const experiments: ExperimentStory[] = [
  ...uiStories,
  ...interactiveUiMdxStories,
  ...blogMdxStories,
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

