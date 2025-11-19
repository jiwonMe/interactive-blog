import React from 'react';
import { InteractivePanel, Playground } from "@repo/interactive-ui";

export type ExperimentItem = {
  slug: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

export const experiments: ExperimentItem[] = [
  {
    slug: "playground",
    title: "Interactive Playground",
    description: "A counter component with local state.",
    component: <Playground />,
  },
  {
    slug: "panel-basic",
    title: "Basic Panel",
    description: "A simple collapsible panel.",
    component: (
      <InteractivePanel title="Basic Panel">
        This is the content of the basic panel.
      </InteractivePanel>
    ),
  },
  {
    slug: "panel-complex",
    title: "Complex Panel",
    description: "A panel with rich content inside.",
    component: (
      <InteractivePanel title="Advanced Features">
        <div className="space-y-4 min-w-[300px]">
          <p>Rich content example:</p>
          <div className="h-20 bg-blue-100 rounded flex items-center justify-center">
            Placeholder Image
          </div>
          <button className="w-full py-2 bg-black text-white rounded">
            Action
          </button>
        </div>
      </InteractivePanel>
    ),
  },
];

export function getExperimentBySlug(slug: string) {
  return experiments.find((e) => e.slug === slug);
}

