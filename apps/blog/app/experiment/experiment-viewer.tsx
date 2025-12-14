"use client";

import { cn } from "../../lib/utils";

type ExperimentViewerProps = {
  render: (props: any) => React.ReactNode;
  values: Record<string, any>;
};

export function ExperimentViewer({ render, values }: ExperimentViewerProps) {
  return (
    <div className="w-full">
      {render(values)}
    </div>
  );
}
