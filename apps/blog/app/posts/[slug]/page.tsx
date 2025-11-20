import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { TableOfContents } from '../../../components/toc';
import { notFound } from 'next/navigation';
import { cn } from '../../../lib/utils';

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }));
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
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
        <Link 
          href="/" 
          className={cn(
            "mb-8 inline-block text-sm font-medium hover:underline transition-colors",
            "text-blue-600 hover:text-blue-800",
            "dark:text-blue-400 dark:hover:text-blue-300"
          )}
        >
          ← Back to home
        </Link>
        <header 
          className={cn(
            "mb-12 border-b pb-8",
            "border-gray-100 dark:border-gray-800"
          )}
        >
          <h1 
            className={cn(
              "text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight",
              "text-gray-900 dark:text-gray-50"
            )}
          >
            {post.title || post.slug.replace(/-/g, ' ')}
          </h1>
          {post.date && (
            <time 
              dateTime={post.date} 
              className={cn(
                "text-sm",
                "text-gray-500 dark:text-gray-400"
              )}
            >
              {formatDate(post.date)}
            </time>
          )}
        </header>
        <CustomMDX source={post.content} />
      </article>
      
      {/* TOC Sidebar - only visible on large screens */}
      <TableOfContents toc={post.toc} />
    </div>
  );
}

