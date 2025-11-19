import Link from 'next/link';
import { getPostSlugs } from '../lib/posts';

export default function Home() {
  const slugs = getPostSlugs().map(slug => slug.replace(/\.mdx$/, ''));

  return (
    <main className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">Interactive Tech Blog</h1>
      <p className="text-xl text-gray-600 mb-16 leading-relaxed">
        Next.js 15, MDX, 그리고 Stitches로 만드는 인터랙티브 기술 블로그입니다.
      </p>
      
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
          Recent Posts
        </h2>
        <ul className="space-y-6">
          {slugs.map(slug => (
            <li key={slug}>
              <Link href={`/posts/${slug}`} className="group block">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors capitalize">
                  {slug.replace(/-/g, ' ')}
                </h3>
                <p className="text-gray-500 text-sm">Read article →</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-bold mb-4">Experiments</h2>
        <p className="mb-4 text-gray-700">
          Check out the <Link href="/experiment" className="text-blue-600 hover:underline font-medium">component playground →</Link> to see our interactive UI elements in action.
        </p>
      </section>
    </main>
  );
}
