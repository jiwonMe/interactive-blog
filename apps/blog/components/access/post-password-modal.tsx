'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../../lib/utils';
import { verifyPostPassword } from '../../lib/post-access';

interface PostPasswordModalProps {
  slug: string;
  title?: string;
  defaultOpen?: boolean;
}

export function PostPasswordModal({ slug, title, defaultOpen = false }: PostPasswordModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 모달 표시 여부
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // 비밀번호 입력값
  const [password, setPassword] = useState('');
  // 에러 메시지
  const [error, setError] = useState<string | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 기본 오픈 + ?unlock=true일 때 오픈
  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
      return;
    }
    const unlockParam = searchParams.get('unlock');
    if (unlockParam === 'true') {
      setIsOpen(true);
    }
  }, [defaultOpen, searchParams]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPassword('');
    setError(null);

    // URL에서 unlock 파라미터 제거
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('unlock');
    router.replace(newUrl.pathname + newUrl.search);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyPostPassword(slug, password);

      if (result.success) {
        handleClose();
        // 서버 컴포넌트 재렌더링(쿠키 반영)
        router.refresh();
      } else {
        setError(result.error || '인증에 실패했습니다.');
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [slug, password, router, handleClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        // overlay
        "fixed inset-0 z-[100]",
        // background
        "bg-black/50 backdrop-blur-sm",
        // flex center
        "flex items-center justify-center",
        // padding
        "p-4"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          // container
          "w-full max-w-sm",
          // background
          "bg-white dark:bg-zinc-900",
          // border
          "border border-zinc-200 dark:border-zinc-700",
          // shadow
          "shadow-2xl",
          // radius
          "rounded-xl",
          // padding
          "p-6"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2
            className={cn(
              // typography
              "text-xl font-bold",
              // color
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            🔒 비공개 포스트
          </h2>
          <p
            className={cn(
              // typography
              "text-sm mt-1",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {title ? `${title}에 접근하려면 비밀번호를 입력하세요.` : '접근하려면 비밀번호를 입력하세요.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="post-password"
              className={cn(
                // typography
                "block text-sm font-medium mb-2",
                // color
                "text-zinc-700 dark:text-zinc-300"
              )}
            >
              비밀번호
            </label>
            <input
              id="post-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력..."
              autoFocus
              className={cn(
                // size
                "w-full px-4 py-2",
                // typography
                "text-sm",
                // border
                "border rounded-lg",
                "border-zinc-300 dark:border-zinc-600",
                // background
                "bg-white dark:bg-zinc-800",
                // color
                "text-zinc-900 dark:text-zinc-100",
                // placeholder
                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                // focus
                "focus:outline-none focus:ring-2",
                "focus:ring-blue-500 dark:focus:ring-blue-400",
                // transition
                "transition-colors"
              )}
            />
          </div>

          {error && (
            <div
              className={cn(
                // layout
                "mb-4 px-3 py-2",
                // background
                "bg-red-50 dark:bg-red-900/30",
                // border
                "border border-red-200 dark:border-red-800",
                // radius
                "rounded-lg",
                // typography
                "text-sm",
                // color
                "text-red-600 dark:text-red-400"
              )}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                // size
                "flex-1 px-4 py-2",
                // typography
                "text-sm font-medium",
                // background
                "bg-zinc-100 dark:bg-zinc-800",
                // color
                "text-zinc-700 dark:text-zinc-300",
                // border
                "border border-zinc-200 dark:border-zinc-700",
                // radius
                "rounded-lg",
                // hover
                "hover:bg-zinc-200 dark:hover:bg-zinc-700",
                // transition
                "transition-colors"
              )}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className={cn(
                // size
                "flex-1 px-4 py-2",
                // typography
                "text-sm font-medium",
                // background
                "bg-blue-600 dark:bg-blue-500",
                // color
                "text-white",
                // radius
                "rounded-lg",
                // hover
                "hover:bg-blue-700 dark:hover:bg-blue-600",
                // disabled
                "disabled:opacity-50 disabled:cursor-not-allowed",
                // transition
                "transition-colors"
              )}
            >
              {isLoading ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

