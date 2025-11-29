import Link from 'next/link';
import { Suspense } from 'react';
import { getAllPosts } from '../lib/posts';
import { cn } from '../lib/utils';
import { PwnzLogo } from '../components/pwnz-logo';
import { ThemeToggle } from '../components/theme-toggle';
import { AdminPasswordModal, AdminBadge } from '../components/admin';
import { isAdminAuthenticated } from '../lib/admin';
import { Metadata } from 'next';

/**
 * ISR(Incremental Static Regeneration) 설정
 * - 빌드 시 정적 생성 후 1시간마다 갱신
 * - SEO: 항상 최신 포스트 목록 제공
 */
export const revalidate = 3600; // 1시간 (초 단위)

export const metadata: Metadata = {
  // 메인 페이지 제목
  title: "PWNZ INTERACTIVES",
  // 메인 페이지 설명
  description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
  
  // Open Graph
  openGraph: {
    title: "PWNZ INTERACTIVES",
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
  },
  
  // Twitter Card
  twitter: {
    title: "PWNZ INTERACTIVES",
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
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
          "text-zinc-800 dark:text-zinc-100"
        )}
      >
        INTERACTIVES
      </h1>
    </div>
  );
}

export default async function Home() {
  // Admin 인증 상태 확인
  const isAdmin = await isAdminAuthenticated();
  // Admin이면 hidden 포스트 포함
  const posts = getAllPosts(isAdmin);

  return (
    <main className="w-full flex flex-col items-center">
      {/* Admin 비밀번호 모달 (클라이언트 컴포넌트) */}
      <Suspense fallback={null}>
        <AdminPasswordModal />
      </Suspense>
      
      {/* Theme Toggle - Fixed to top right */}
      <div
        className={cn(
          // positioning
          "fixed top-4 right-4 z-50",
          // layout
          "flex items-center gap-2"
        )}
      >
        {/* Admin 배지 (인증된 경우만 표시) */}
        {isAdmin && <AdminBadge />}
        <ThemeToggle
          className={cn(
            // border
            "border-none"
          )}
        />
      </div>
      <div className="dark:bg-zinc-950 w-full py-6 sm:py-12 px-3 sm:px-6 border-dashed border-b border-zinc-300 dark:border-zinc-700">
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
      <div className="dark:bg-zinc-950 w-full py-6 sm:py-10 px-3 sm:px-6">
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
                  <li 
                    key={post.slug}
                    className={cn(
                      // hidden 포스트 구분용 스타일
                      post.hidden && "relative pl-4 border-l-2 border-dashed border-amber-500 dark:border-amber-400"
                    )}
                  >
                    <Link href={`/posts/${post.slug}`} className="group flex">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={cn(
                            // display
                            "inline-block",  
                            // typography
                            "text-xl font-semibold mb-2 transition-colors",
                            // hover effects
                            "group-hover:bg-blue-200/20 dark:group-hover:bg-blue-800/20",
                            "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                            "group-hover:border-opacity-100 transition-opacity duration-200",
                            // border
                            "border-b dark:border-opacity-0 border-opacity-0 border-blue-500 dark:border-blue-400 border-dashed",
                            // colors
                            "text-zinc-800 dark:text-zinc-100",
                            // hidden 포스트 스타일
                            post.hidden && "text-amber-700 dark:text-amber-400"
                          )}
                        >
                          {post.title || post.slug.replace(/-/g, ' ')}
                          <span className="flex-shrink-0 opacity-0 
                      group-hover:opacity-100 transition-opacity w-6 duration-200">
                          {' '}→</span>
                        </h3>
                        {/* Hidden 배지 */}
                        {post.hidden && (
                          <span
                            className={cn(
                              // layout
                              "inline-flex items-center px-2 py-0.5 mb-2",
                              // typography
                              "text-xs font-medium",
                              // colors
                              "bg-amber-100 text-amber-800",
                              "dark:bg-amber-900/50 dark:text-amber-300",
                              // border
                              "rounded-full border border-amber-300 dark:border-amber-700"
                            )}
                          >
                            🔒 Hidden
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-3 text-sm",
                          "text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {post.date && (
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        )}
                      </div>
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
                  "text-zinc-800 dark:text-zinc-100"
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
