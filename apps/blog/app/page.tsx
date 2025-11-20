import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { cn } from '../lib/utils';

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto py-20 px-6">
      <h1 
        className={cn(
          "text-5xl font-extrabold mb-6 tracking-tight",
          "text-gray-900 dark:text-gray-50"
        )}
      >
        Interactive Tech Blog
      </h1>
      <p 
        className={cn(
          "text-xl mb-16 leading-relaxed",
          "text-gray-600 dark:text-gray-300"
        )}
      >
        Next.js 15, MDX, 그리고 Stitches로 만드는 인터랙티브 기술 블로그입니다.
      </p>
      
      <section className="mb-20">
        <h2 
          className={cn(
            "text-2xl font-bold mb-8 flex items-center gap-2",
            "text-gray-900 dark:text-gray-100"
          )}
        >
          <span 
            className={cn(
              "w-1 h-8 block",
              "bg-blue-600 dark:bg-blue-500"
            )}
          ></span>
          Recent Posts
        </h2>
        <ul className="space-y-6">
          {posts.map(post => (
            post && (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <h3 
                    className={cn(
                      "text-xl font-semibold mb-2 transition-colors",
                      "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                      "text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {post.title || post.slug.replace(/-/g, ' ')}
                  </h3>
                  <div 
                    className={cn(
                      "flex items-center gap-3 text-sm",
                      "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {post.date && (
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    )}
                    <span>→</span>
                  </div>
                </Link>
              </li>
            )
          ))}
        </ul>
      </section>

      {process.env.NODE_ENV === 'development' && (
        <section 
          className={cn(
            "border-t pt-12",
            "border-gray-100 dark:border-gray-800"
          )}
        >
          <h2 
            className={cn(
              "text-2xl font-bold mb-4",
              "text-gray-900 dark:text-gray-100"
            )}
          >
            Experiments
          </h2>
          <p 
            className={cn(
              "mb-4",
              "text-gray-700 dark:text-gray-300"
            )}
          >
            Check out the <Link href="/experiment" className="text-blue-600 hover:underline font-medium dark:text-blue-400">component playground →</Link> to see our interactive UI elements in action.
          </p>
        </section>
      )}
    </main>
  );
}
