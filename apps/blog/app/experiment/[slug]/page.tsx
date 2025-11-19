import { notFound } from "next/navigation";
import { getExperimentBySlug, experiments } from "../registry";

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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{experiment.title}</h1>
        <p className="text-gray-500">{experiment.description}</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center min-h-[400px]">
        {experiment.component}
      </div>
    </div>
  );
}

