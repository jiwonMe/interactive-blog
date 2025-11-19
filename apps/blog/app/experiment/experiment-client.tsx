"use client";

import { getExperimentBySlug } from "./registry";
import { ExperimentViewer } from "./experiment-viewer";
import { notFound } from "next/navigation";
import Link from "next/link";

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
          className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 hover:underline transition-colors"
        >
          ← 실험 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-2">{experiment.title}</h1>
        <p className="text-gray-500">{experiment.description}</p>
      </div>
      
      <ExperimentViewer 
        render={experiment.render} 
        controls={experiment.controls} 
      />
    </div>
  );
}

