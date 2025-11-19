import { notFound } from "next/navigation";
import { getExperimentBySlug, experiments } from "../registry";
import { ExperimentViewer } from "../experiment-viewer";

export async function generateStaticParams() {
  return experiments.map((exp) => ({
    slug: exp.slug,
  }));
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2">{experiment.title}</h1>
        <p className="text-gray-500">{experiment.description}</p>
      </div>
      
      <ExperimentViewer>
        {experiment.component}
      </ExperimentViewer>
    </div>
  );
}

