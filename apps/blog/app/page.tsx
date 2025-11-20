import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { cn } from '../lib/utils';
import { PwnzLogo } from '../components/pwnz-logo';
import { ThemeToggle } from '../components/theme-toggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // 메인 페이지 제목
  title: "Home",
  // 메인 페이지 설명
  description: "인터랙티브 컴포넌트와 함께 컴퓨터 과학을 경험하세요. 실습 가능한 예제와 함께하는 기술 블로그입니다.",
  
  // Open Graph
  openGraph: {
    title: "JIWON's Interactive Blog - Home",
    description: "인터랙티브 컴포넌트와 함께 컴퓨터 과학을 경험하세요. 실습 가능한 예제와 함께하는 기술 블로그입니다.",
  },
  
  // Twitter Card
  twitter: {
    title: "JIWON's Interactive Blog - Home",
    description: "인터랙티브 컴포넌트와 함께 컴퓨터 과학을 경험하세요. 실습 가능한 예제와 함께하는 기술 블로그입니다.",
  },
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function MainTitle() {
  return (
    <div>
      <PwnzLogo
        className="-mb-2 hidden md:block"
        width={200}
      />
      <PwnzLogo
        className="-mb-1 block md:hidden"
        width={120}
      />
      <h1
        className={cn(
          "md:text-2xl text-md font-bold mb-2 tracking-[0.5em] pl-5 md:pl-10",
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        INTERACTIVES
      </h1>
    </div>
  );
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="w-full flex flex-col items-center">
      {/* Theme Toggle - Fixed to top right */}
      <ThemeToggle
        className={cn(
          // positioning
          "fixed top-4 right-4 z-50",
          // border
          "border-none"
        )}
      />
      <div className="bg-white dark:bg-zinc-950 w-full py-6 sm:py-12 px-3 sm:px-6 border-dashed border-b border-zinc-300 dark:border-zinc-700">
        <div className="max-w-3xl mx-auto px-6">
          <MainTitle />
          <p
            className={cn(
              "text-md leading-relaxed",
              "text-zinc-600 dark:text-zinc-300"
            )}
          >
            Experience the Computer Science with Interactives
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-950 w-full py-6 sm:py-10 px-3 sm:px-6">
        <div className="max-w-3xl mx-auto px-6">
          <section className="mb-20">
            {/* <h2
              className={cn(
                "text-2xl font-bold mb-8 flex items-center gap-2",
                "text-zinc-900 dark:text-zinc-100",
                "border-dashed border border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-950",
                "py-2 px-4"
              )}
            >
              Recent Posts
            </h2> */}
            <ul className="space-y-6">
              {posts.map(post => (
                post && (
                  <li key={post.slug}>
                    <Link href={`/posts/${post.slug}`} className="group block">
                      <h3
                        className={cn(
                          "text-xl font-semibold mb-2 transition-colors",
                          "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                          "text-zinc-900 dark:text-zinc-100"
                        )}
                      >
                        {post.title || post.slug.replace(/-/g, ' ')}
                      </h3>
                      <div
                        className={cn(
                          "flex items-center gap-3 text-sm",
                          "text-zinc-500 dark:text-zinc-400"
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
                "border-zinc-100 dark:border-zinc-800"
              )}
            >
              <h2
                className={cn(
                  "text-2xl font-bold mb-4",
                  "text-zinc-900 dark:text-zinc-100"
                )}
              >
                Experiments
              </h2>
              <p
                className={cn(
                  "mb-4",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                Check out the <Link href="/experiment" className="text-blue-600 hover:underline font-medium dark:text-blue-400">component playground →</Link> to see our interactive UI elements in action.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
