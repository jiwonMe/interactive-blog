import Link from 'next/link';
import { getPostSlugs } from '../lib/posts';

export default function Home() {
  const slugs = getPostSlugs().map(slug => slug.replace(/\.mdx$/, ''));

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Interactive Blog</h1>
      <p className="text-lg text-gray-700 mb-8">
        This blog features interactive components powered by Stitches.
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      <ul className="space-y-4">
        {slugs.map(slug => (
          <li key={slug}>
            <Link href={`/posts/${slug}`} className="text-blue-600 hover:underline text-xl capitalize">
              {slug.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
