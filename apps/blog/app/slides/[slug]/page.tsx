import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSlideDeck, getAllSlideSlugs } from "../../../lib/slides";
import { SlideViewerClient } from "./slide-viewer-client";
import { SlideRenderer } from "../../../components/slides/viewer/slide-renderer";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllSlideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slideDeck = getSlideDeck(slug);

  if (!slideDeck) {
    return { title: "슬라이드를 찾을 수 없습니다" };
  }

  return {
    title: `${slideDeck.title} - 슬라이드`,
    description: `${slideDeck.title} 프레젠테이션`,
    robots: { index: false, follow: false },
  };
}

export default async function SlidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slideDeck = getSlideDeck(slug);

  if (!slideDeck) {
    notFound();
  }

  const renderedSlides = await Promise.all(
    slideDeck.slides.map(async (slide) => (
      <SlideRenderer
        key={slide.index}
        content={slide.content}
        slug={slug}
        title={slideDeck.title}
      />
    )),
  );

  return (
    <SlideViewerClient
      slug={slug}
      title={slideDeck.title}
      slides={renderedSlides}
    />
  );
}
