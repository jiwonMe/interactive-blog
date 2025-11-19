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
      <ul className="space-y-4 mb-10">
        {slugs.map(slug => (
          <li key={slug}>
            <Link href={`/posts/${slug}`} className="text-blue-600 hover:underline text-xl capitalize">
              {slug.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Experiments</h2>
        <p className="mb-4 text-gray-700">
          Check out the <Link href="/experiment" className="text-blue-600 hover:underline font-medium">component playground →</Link> to see our interactive UI elements in action.
        </p>
      </div>
    </main>
  );
}
