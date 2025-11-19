import { experiments } from "../registry";
import { ExperimentClient } from "../experiment-client";

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
  
  return <ExperimentClient slug={slug} />;
}

