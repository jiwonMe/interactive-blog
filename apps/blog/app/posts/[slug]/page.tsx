import Link from 'next/link';
import { getPostBySlug, getPostSlugs, getSeriesPosts } from '../../../lib/posts';
import { CustomMDX } from '../../../components/mdx-remote';
import { TableOfContents } from '../../../components/toc';
import { notFound } from 'next/navigation';
import { cn } from '../../../lib/utils';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
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
      title: 'Post Not Found',
    };
  }

  const title = post.title || post.slug.replace(/-/g, ' ');
  const description = post.description || '블로그 포스트';
  const author = post.author || 'JIWON';
  
  // 이미지 URL 처리: 절대 경로인 경우 그대로 사용, 상대 경로인 경우 도메인 추가
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `https://jiwon.me${post.image}`)
    : 'https://jiwon.me/og-default.png'; // 기본 OG 이미지

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
      url: `https://jiwon.me/posts/${slug}`,
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
      siteName: 'JIWON Blog',
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
      creator: '@jiwonme',
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
  
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];

  return (
    <div 
      // Main container layout
      className={cn(
        "max-w-7xl mx-auto px-6 py-12 flex justify-center relative"
      )}
    >
      <article 
        // Article content width constraint
        className={cn(
          "w-full max-w-3xl"
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
            "border-gray-100 dark:border-gray-800"
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
          <h1 
            className={cn(
              // Title typography
              "text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight",
              // Text colors
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {post.title || post.slug.replace(/-/g, ' ')}
          </h1>
          
          <div 
            // Meta info container
            className={cn(
              "flex flex-wrap items-center gap-4 text-sm",
              "text-gray-500 dark:text-gray-400"
            )}
          >
            {post.date && (
              <time dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    // Tag styling
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      // Tag colors
                      "bg-gray-100 text-gray-700",
                      "dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {post.series && seriesPosts.length > 0 && (
          <div 
            // Series navigation box
            className={cn(
              "mb-12 p-6 rounded-xl border",
              // Colors
              "bg-gray-50 dark:bg-gray-900/50",
              "border-gray-200 dark:border-gray-800"
            )}
          >
            <h3 
              className={cn(
                "font-bold mb-4 text-lg flex items-center gap-2",
                "text-gray-900 dark:text-gray-100"
              )}
            >
              📚 {post.series} 시리즈
            </h3>
            <ul className="space-y-2">
              {seriesPosts.map((p, index) => (
                <li key={p.slug} className="flex items-start gap-2 text-sm">
                  <span 
                     className={cn(
                       "font-mono text-gray-400 w-6 text-right",
                       p.slug === post.slug && "text-blue-500 font-bold"
                     )}
                  >
                    {index + 1}.
                  </span>
                  {p.slug === post.slug ? (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {p.title || p.slug} (현재 글)
                    </span>
                  ) : (
                    <Link 
                      href={`/posts/${p.slug}`}
                      className={cn(
                        "hover:underline decoration-blue-500/30 underline-offset-4",
                        "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
               "border-gray-100 dark:border-gray-800"
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
                         "border-gray-200 dark:border-gray-800",
                         "hover:border-blue-500 dark:hover:border-blue-500"
                       )}
                     >
                       <div className="text-xs text-gray-500 mb-1">← 이전 글</div>
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
                         "border-gray-200 dark:border-gray-800",
                         "hover:border-blue-500 dark:hover:border-blue-500"
                       )}
                     >
                       <div className="text-xs text-gray-500 mb-1">다음 글 →</div>
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
      <TableOfContents toc={post.toc} />
    </div>
  );
}
