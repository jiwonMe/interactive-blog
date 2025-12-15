import Link from 'next/link';
import { Suspense } from 'react';
import { getPostBySlug, getAllPosts, getSeriesPosts, isTranslatedPost } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { notFound } from 'next/navigation';
import { cn } from '../../../lib/utils';
import { Metadata } from 'next';
import { generateBibTeX } from '../../../lib/bibtex';
import { BibTeXCopyButton } from '../../../components/bibtex-copy-button';
import { AdminPasswordModal, AdminBadge } from '../../../components/admin';
import { isAdminAuthenticated } from '../../../lib/admin';
import { isPostPasswordAuthenticated } from '../../../lib/post-access';
import { ArticleJsonLd, BreadcrumbJsonLd } from '../../../components/json-ld';
import { 
  TableOfContentsWrapper, 
  ScrollTrackerWrapper, 
  ReadingTimeTrackerWrapper,
  ArticleFeedbackWrapper
} from '../../../components/client-wrappers';
import { ProtectedPost } from './protected-post';

/**
 * ISR(Incremental Static Regeneration) 설정
 * - 빌드 시 정적 생성된 페이지를 1시간마다 갱신
 * - SEO: 검색엔진에 항상 최신 콘텐츠 제공
 * - 성능: 정적 페이지로 빠른 응답 속도 유지
 */
export const revalidate = 3600; // 1시간 (초 단위)

/**
 * 동적 파라미터 허용 안함
 * - 빌드 시 생성되지 않은 경로는 404 반환
 * - SEO: 존재하지 않는 페이지 크롤링 방지
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  // hidden 포스트도 라우트는 생성(접근은 서버에서 가드)
  const posts = getAllPosts(true);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
    };
  }

  // hidden 포스트는 인증 전엔 noindex 처리(메타데이터로 노출 최소화)
  const isDev = process.env.NODE_ENV === 'development';
  if (post.hidden && !isDev) {
    const isAdmin = await isAdminAuthenticated();
    // post 객체에서 직접 password 확인 (더 안정적)
    const isPasswordEnabled = !!post.password;
    const isPasswordAuthed = await isPostPasswordAuthenticated(slug);

    const canAccessHidden = isAdmin || (isPasswordEnabled && isPasswordAuthed);

    if (!canAccessHidden) {
      return {
        title: '비공개 포스트',
        description: '비밀번호가 필요한 포스트입니다.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }
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

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  
  // Admin 인증 상태 확인
  const isAdmin = await isAdminAuthenticated();
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isDev = process.env.NODE_ENV === 'development';
  // post 객체에서 직접 password 확인 (더 안정적)
  const isPasswordEnabled = !!post.password;
  const isPasswordAuthed = await isPostPasswordAuthenticated(slug);
  const canAccessHidden = isDev || isAdmin || (isPasswordEnabled && isPasswordAuthed);

  // 프로덕션에서 hidden 포스트 접근 시: admin 또는 글 비밀번호 인증 필요
  if (post.hidden && !canAccessHidden) {
    if (isPasswordEnabled) {
      return <ProtectedPost slug={slug} title={post.title} />;
    }
    notFound();
  }

  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];
  const postUrl = `https://pwnz.kr/posts/${slug}`;

  return (
    <>
      {/* SEO: JSON-LD 구조화 데이터 */}
      <ArticleJsonLd post={post} url={postUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://pwnz.kr' },
          { name: 'Posts', url: 'https://pwnz.kr/posts' },
          { name: post.title || post.slug, url: postUrl },
        ]}
      />
      
      <div 
        // Main container layout
        className={cn(
          /* Layout */
          "max-w-7xl mx-auto",
          /* Spacing */
          "px-4 sm:px-6 py-12",
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
          {post.hidden && (isDev || isAdmin || isPasswordAuthed) && (
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
          {isTranslatedPost(post) && (
            <span
              className={cn(
                /* Layout */
                "ml-3 inline-flex items-center align-middle",
                /* Typography */
                "text-sm font-semibold",
                /* Color */
                "text-blue-700 dark:text-blue-300",
                /* Background */
                "bg-blue-100/70 dark:bg-blue-900/30",
                /* Shape */
                "rounded-full",
                /* Spacing */
                "px-3 py-1",
                /* Border: none */
                "border-0"
              )}
            >
              번역
            </span>
          )}
          <h1 
            className={cn(
              // Title typography
              "text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-[52px]",
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
                      href={`/posts/${p.slug}`}
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

        <ArticleFeedbackWrapper
          articleSlug={post.slug}
          articleTitle={post.title || post.slug}
        />

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
                       href={`/posts/${prevPost.slug}`}
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
                       href={`/posts/${nextPost.slug}`}
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
      
      {/* TOC Sidebar - only visible on large screens, lazy loaded */}
      <TableOfContentsWrapper toc={post.toc} articleSlug={post.slug} />
      
      {/* Analytics Trackers - Lazy loaded, no SSR */}
      <ScrollTrackerWrapper articleSlug={post.slug} />
      <ReadingTimeTrackerWrapper
        articleSlug={post.slug}
        articleTitle={post.title || post.slug}
      />
      </div>
    </div>
    </>
  );
}
