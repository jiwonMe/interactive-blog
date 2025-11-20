import { experiments } from "../registry";
import { ExperimentClient } from "../experiment-client";

export async function generateStaticParams() {
  return experiments.map((exp) => ({
    slug: exp.slug.split('/'),
  }));
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join('/');
  
  return <ExperimentClient slug={slugString} />;
}
