"use client";

import { getExperimentBySlug } from "./registry";
import { ExperimentViewer } from "./experiment-viewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "../../lib/utils";

export function ExperimentClient({ slug }: { slug: string }) {
  const experiment = getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  return (
    <div className="w-full max-w-6xl px-4">
      <div className="mb-12 text-left">
        <Link 
          href="/experiment" 
          className={cn(
            "inline-block text-sm font-medium mb-6 hover:underline transition-colors",
            "text-blue-600 hover:text-blue-800",
            "dark:text-blue-400 dark:hover:text-blue-300"
          )}
        >
          ← 실험 목록으로 돌아가기
        </Link>
        <h1 
          className={cn(
            "text-3xl font-bold mb-2",
            "text-gray-900 dark:text-gray-50"
          )}
        >
          {experiment.title}
        </h1>
        <p 
          className={cn(
            "text-gray-500 dark:text-gray-400"
          )}
        >
          {experiment.description}
        </p>
      </div>
      
      <ExperimentViewer 
        render={experiment.render} 
        controls={experiment.controls} 
      />
    </div>
  );
}

