import { experiments } from "../registry";
import { ExperimentHubClient } from "../experiment-hub/ExperimentHubClient";

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

  return <ExperimentHubClient initialSlug={slugString} />;
}
