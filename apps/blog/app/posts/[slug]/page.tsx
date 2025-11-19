import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15 expects params to be a Promise or just params.
  // In the latest Next.js 15 canary/rc, params is sometimes awaited, but standard usage is synchronous for now unless async params is fully enforced.
  // Let's assume standard behavior or await if it's a promise. 
  // Actually Next.js 15 (stable) might treat params as a Promise in the future or now.
  // Safe bet:
  const { slug } = await params; 
  
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8 capitalize">{post.slug.replace(/-/g, ' ')}</h1>
      <CustomMDX source={post.content} />
    </article>
  );
}

