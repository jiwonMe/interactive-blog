import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { TableOfContents } from '../../../components/toc';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center relative">
      <article className="w-full max-w-3xl">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block text-sm font-medium">
          ← Back to home
        </Link>
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize tracking-tight leading-tight">
            {post.slug.replace(/-/g, ' ')}
          </h1>
        </header>
        <CustomMDX source={post.content} />
      </article>
      
      {/* TOC Sidebar - only visible on large screens */}
      <TableOfContents toc={post.toc} />
    </div>
  );
}

