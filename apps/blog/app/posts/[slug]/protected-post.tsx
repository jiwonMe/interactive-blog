import Link from 'next/link';
import { cn } from '../../../lib/utils';
import { AdminPasswordModal } from '../../../components/admin';
import { PostPasswordModal } from '../../../components/access';

interface ProtectedPostProps {
  slug: string;
  title?: string;
}

export function ProtectedPost({ slug, title }: ProtectedPostProps) {
  return (
    <div
      className={cn(
        // layout
        "min-h-[calc(100vh-120px)]",
        // flex center
        "flex items-center justify-center",
        // padding
        "px-6 py-16"
      )}
    >
      {/* 글 비밀번호 입력 모달: 기본 오픈 */}
      <PostPasswordModal slug={slug} title={title} defaultOpen />

      {/* Admin 인증 모달: ?admin=true로 열림 */}
      <AdminPasswordModal />

      <div
        className={cn(
          // container
          "w-full max-w-lg",
          // background
          "bg-white dark:bg-zinc-900",
          // border
          "border border-zinc-200 dark:border-zinc-800",
          // radius
          "rounded-2xl",
          // padding
          "p-6"
        )}
      >
        <div className="space-y-3">
          <h1
            className={cn(
              // typography
              "text-2xl font-bold",
              // color
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            🔒 비공개 포스트
          </h1>
          <p
            className={cn(
              // typography
              "text-sm",
              // color
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            이 글은 공개 목록에 노출되지 않습니다. 비밀번호를 알고 있다면 입력해서 접근할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`?unlock=true`}
              className={cn(
                // size
                "px-4 py-2",
                // typography
                "text-sm font-medium",
                // border
                "border rounded-lg",
                "border-blue-200 dark:border-blue-700",
                // background
                "bg-blue-50 dark:bg-blue-900/20",
                // color
                "text-blue-700 dark:text-blue-300",
                // hover
                "hover:bg-blue-100 dark:hover:bg-blue-900/35",
                // transition
                "transition-colors"
              )}
            >
              비밀번호 입력하기
            </Link>
            <Link
              href={`?admin=true`}
              className={cn(
                // size
                "px-4 py-2",
                // typography
                "text-sm font-medium",
                // border
                "border rounded-lg",
                "border-zinc-200 dark:border-zinc-700",
                // background
                "bg-zinc-50 dark:bg-zinc-800",
                // color
                "text-zinc-800 dark:text-zinc-200",
                // hover
                "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                // transition
                "transition-colors"
              )}
            >
              Admin 비밀번호로 열기
            </Link>
            <Link
              href="/"
              className={cn(
                // size
                "px-4 py-2",
                // typography
                "text-sm font-medium",
                // border
                "border rounded-lg",
                "border-zinc-200 dark:border-zinc-700",
                // background
                "bg-white dark:bg-zinc-900",
                // color
                "text-zinc-800 dark:text-zinc-200",
                // hover
                "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                // transition
                "transition-colors"
              )}
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

