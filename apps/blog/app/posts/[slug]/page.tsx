import Link from 'next/link';
import { Suspense } from 'react';
import { getPostBySlug, getAllPosts, getSeriesPosts } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { TableOfContents } from '../../../components/toc';
import { notFound } from 'next/navigation';
import { cn } from '../../../lib/utils';
import { Metadata } from 'next';
import { generateBibTeX } from '../../../lib/bibtex';
import { BibTeXCopyButton } from '../../../components/bibtex-copy-button';
import { ScrollTracker } from '../../../components/analytics/scroll-tracker';
import { ReadingTimeTracker } from '../../../components/analytics/reading-time-tracker';
import { AdminPasswordModal, AdminBadge } from '../../../components/admin';
import { isAdminAuthenticated } from '../../../lib/admin';

export async function generateStaticParams() {
  const posts = getAllPosts();
  // 프로덕션 빌드 시 hidden 포스트 제외
  const isDev = process.env.NODE_ENV === 'development';
  const filteredPosts = isDev ? posts : posts.filter(post => !post.hidden);
  
  return filteredPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedLocale = typeof resolvedSearchParams.lang === 'string' 
    ? resolvedSearchParams.lang.toLowerCase() 
    : undefined;
  const post = getPostBySlug(slug, requestedLocale);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
    };
  }

  const title = post.title || post.slug.replace(/-/g, ' ');
  const description = post.description || '인터랙티브 컴포넌트와 함께하는 기술 블로그';
  const author = post.author || 'PWNZ';
  
  // 이미지 URL 처리: 절대 경로인 경우 그대로 사용, 상대 경로인 경우 도메인 추가
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `https://pwnz.kr${post.image}`)
    : 'https://pwnz.kr/og-default.png'; // 기본 OG 이미지

  return {
    // 기본 메타데이터
    title,
    description,
    authors: [{ name: author }],
    
    // Open Graph
    openGraph: {
      // 페이지 제목
      title,
      // 페이지 설명
      description,
      // 페이지 타입 (article로 설정)
      type: 'article',
      // 페이지 URL
      url: `https://pwnz.kr/posts/${slug}`,
      // OG 이미지
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      // 작성자
      authors: [author],
      // 발행일
      publishedTime: post.date,
      // 태그
      tags: post.tags,
      // 사이트 이름
      siteName: 'PWNZ INTERACTIVES',
    },
    
    // Twitter Card
    twitter: {
      // Card 타입 (큰 이미지)
      card: 'summary_large_image',
      // 제목
      title,
      // 설명
      description,
      // 이미지
      images: [imageUrl],
      // 작성자 트위터 핸들 (있는 경우)
      creator: '@pwnz',
    },
    
    // 추가 메타 태그
    keywords: post.tags,
  };
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function Post({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { slug } = await params; 
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedLocale = typeof resolvedSearchParams.lang === 'string'
    ? resolvedSearchParams.lang.toLowerCase()
    : undefined;
  
  // Admin 인증 상태 확인
  const isAdmin = await isAdminAuthenticated();
  const post = getPostBySlug(slug, requestedLocale);

  if (!post) {
    notFound();
  }

  // 프로덕션에서 hidden 포스트 접근 시: admin 인증 필요
  const isDev = process.env.NODE_ENV === 'development';
  if (post.hidden && !isDev && !isAdmin) {
    notFound();
  }

  const seriesPosts = post.series ? getSeriesPosts(post.series, post.locale) : [];

  const buildLocaleHref = (targetLocale: string) => {
    return targetLocale === post.defaultLocale
      ? `/posts/${post.slug}`
      : `/posts/${post.slug}?lang=${targetLocale}`;
  };

  const buildLocalizedPostHref = (targetSlug: string) => {
    return post.locale === post.defaultLocale
      ? `/posts/${targetSlug}`
      : `/posts/${targetSlug}?lang=${post.locale}`;
  };

  return (
    <div 
      // Main container layout
      className={cn(
        "max-w-7xl mx-auto px-6 py-12",
        // Full width
        "w-full"
      )}
    >
      {/* Admin 비밀번호 모달 */}
      <Suspense fallback={null}>
        <AdminPasswordModal />
      </Suspense>
      
      {/* Admin 배지 - 우측 상단 고정 */}
      {isAdmin && (
        <div
          className={cn(
            // positioning
            "fixed top-4 right-20 z-50"
          )}
        >
          <AdminBadge />
        </div>
      )}
      
      <div
        // Content wrapper with flex layout
        className={cn(
          "flex justify-center gap-0 relative"
        )}
      >
      <article 
        // Article content width constraint
        className={cn(
          "w-full max-w-3xl flex-shrink-0",
          // Prevent content from overflowing
          "overflow-x-hidden"
        )}
      >
        {/* <Link 
          href="/" 
          className={cn(
            // Back link styling
            "mb-8 inline-block text-sm font-medium hover:underline transition-colors",
            // Light mode colors
            "text-blue-600 hover:text-blue-800",
            // Dark mode colors
            "dark:text-blue-400 dark:hover:text-blue-300"
          )}
        >
          ← Back to home
        </Link> */}
        <header 
          className={cn(
            // Header bottom border and spacing
            "mb-12 border-b pb-8",
            // Border colors
            "border-zinc-100 dark:border-zinc-800"
          )}
        >
          {post.series && (
            <div 
              // Series label styling
              className={cn(
                "mb-4 text-sm font-medium tracking-wide uppercase",
                "text-blue-600 dark:text-blue-400"
              )}
            >
              Series: {post.series}
            </div>
          )}
          {/* Hidden 포스트 경고 배너 (개발 모드 또는 Admin 모드에서만 표시) */}
          {post.hidden && (isDev || isAdmin) && (
            <div
              className={cn(
                // layout
                "mb-4 px-4 py-3 rounded-lg",
                // colors
                "bg-amber-50 dark:bg-amber-900/30",
                // border
                "border border-amber-300 dark:border-amber-700"
              )}
            >
              <div
                className={cn(
                  // layout
                  "flex items-center gap-2",
                  // typography
                  "text-sm font-medium",
                  // colors
                  "text-amber-800 dark:text-amber-300"
                )}
              >
                🔒 이 포스트는 Hidden 상태입니다. 프로덕션에서는 보이지 않습니다.
              </div>
            </div>
          )}
          <h1 
            className={cn(
              // Title typography
              "text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight",
              // Text colors
              "text-zinc-900 dark:text-zinc-50",
              // Balanced text wrapping
              "text-balance",
              // Keep CJK words together (word-break: keep-all)
              "break-keep"
            )}
          >
            {post.title || post.slug.replace(/-/g, ' ')}
          </h1>
          
          <BibTeXCopyButton bibtex={generateBibTeX(post)} post={post}>
            <div 
              // Meta info container
              className={cn(
                "flex flex-wrap items-center gap-1 text-sm",
                "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {post.author && (
                <span>
                  {post.author}
                </span>
              )}
              {post.date && (
                <time dateTime={post.date}>
                  · {formatDate(post.date)}
                </time>
              )}
              {post.affiliate && (
                <span>
                  · {post.affiliate}
                </span>
              )}
            </div>
          </BibTeXCopyButton>
          
          {post.tags && post.tags.length > 0 && (
            <div 
              className={cn(
                // Flex layout with wrapping
                "flex flex-wrap gap-2 mt-3"
              )}
            >
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  // Tag styling
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
                    // Tag colors
                    "bg-zinc-200 text-zinc-700",
                    "dark:bg-zinc-800 dark:text-zinc-300"
                  )}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.availableLocales.length > 1 && (
            <div
              className={cn(
                /* layout */
                "flex flex-wrap items-center gap-2",
                /* spacing */
                "mt-6"
              )}
            >
              <span
                className={cn(
                  /* typography */
                  "text-xs font-semibold uppercase tracking-wide",
                  /* color */
                  "text-zinc-500 dark:text-zinc-400"
                )}
              >
                Language
              </span>
              {post.availableLocales.map((locale) => {
                const isActive = locale === post.locale;
                return (
                  <Link
                    key={locale}
                    href={buildLocaleHref(locale)}
                    replace
                    scroll={false}
                    className={cn(
                      /* layout */
                      "px-3 py-1 rounded-md text-xs font-semibold",
                      /* transition */
                      "transition-colors duration-200",
                      /* active colors */
                      isActive && "bg-blue-600 text-white dark:bg-blue-500",
                      /* inactive colors */
                      !isActive && "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    )}
                  >
                    {locale.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          )}
        </header>

        {post.series && seriesPosts.length > 0 && (
          <div 
            // Series navigation box
            className={cn(
              "mb-12 p-6 rounded-xl border",
              // Colors
              "bg-zinc-50 dark:bg-zinc-900/50",
              "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <h3 
              className={cn(
                "font-bold mb-4 text-lg flex items-center gap-2",
                "text-zinc-900 dark:text-zinc-100"
              )}
            >
              📚 {post.series} Series
            </h3>
            <ul className="space-y-2">
              {seriesPosts.map((p, index) => (
                <li key={p.slug} className="flex items-start gap-2 text-sm">
                  <span 
                     className={cn(
                       "font-mono text-zinc-400 w-6 text-right",
                       p.slug === post.slug && "text-blue-500 font-bold"
                     )}
                  >
                    {index + 1}.
                  </span>
                  {p.slug === post.slug ? (
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {p.title || p.slug} (현재 글)
                    </span>
                  ) : (
                    <Link 
                      href={buildLocalizedPostHref(p.slug)}
                      className={cn(
                        "hover:underline decoration-blue-500/30 underline-offset-4",
                        "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      {p.title || p.slug}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <CustomMDX source={post.content} slug={post.slug} />

        {post.series && seriesPosts.length > 0 && (
           <div 
             // Bottom Series Navigation (Previous/Next)
             className={cn(
               "mt-16 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4",
               "border-zinc-100 dark:border-zinc-800"
             )}
           >
             {(() => {
               const currentIndex = seriesPosts.findIndex(p => p.slug === post.slug);
               const prevPost = seriesPosts[currentIndex - 1];
               const nextPost = seriesPosts[currentIndex + 1];
               
               return (
                 <>
                   {prevPost ? (
                     <Link 
                      href={buildLocalizedPostHref(prevPost.slug)}
                       className={cn(
                         "group p-4 rounded-lg border transition-all",
                         "border-zinc-200 dark:border-zinc-800",
                         "hover:border-blue-500 dark:hover:border-blue-500"
                       )}
                     >
                       <div className="text-xs text-zinc-500 mb-1">← 이전 글</div>
                       <div className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                         {prevPost.title}
                       </div>
                     </Link>
                   ) : <div />}

                   {nextPost ? (
                     <Link 
                      href={buildLocalizedPostHref(nextPost.slug)}
                       className={cn(
                         "group p-4 rounded-lg border transition-all text-right",
                         "border-zinc-200 dark:border-zinc-800",
                         "hover:border-blue-500 dark:hover:border-blue-500"
                       )}
                     >
                       <div className="text-xs text-zinc-500 mb-1">다음 글 →</div>
                       <div className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                         {nextPost.title}
                       </div>
                     </Link>
                   ) : <div />}
                 </>
               );
             })()}
           </div>
        )}
      </article>
      
      {/* TOC Sidebar - only visible on large screens */}
      <TableOfContents toc={post.toc} articleSlug={post.slug} />
      
      {/* Analytics Trackers */}
      <ScrollTracker articleSlug={post.slug} />
      <ReadingTimeTracker
        articleSlug={post.slug}
        articleTitle={post.title || post.slug}
      />
      </div>
    </div>
  );
}
