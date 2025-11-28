'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import { verifyAdminPassword } from '../../lib/admin';

interface AdminPasswordModalProps {
  // 인증 완료 후 콜백
  onAuthenticated?: () => void;
}

export function AdminPasswordModal({ onAuthenticated }: AdminPasswordModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 모달 표시 여부
  const [isOpen, setIsOpen] = useState(false);
  // 비밀번호 입력값
  const [password, setPassword] = useState('');
  // 에러 메시지
  const [error, setError] = useState<string | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // ?admin=true일 때 모달 표시
  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  // 비밀번호 제출 처리
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyAdminPassword(password);
      
      if (result.success) {
        setIsOpen(false);
        setPassword('');
        // URL에서 admin 파라미터 제거
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('admin');
        router.replace(newUrl.pathname + newUrl.search);
        // 페이지 새로고침하여 서버에서 다시 렌더링
        router.refresh();
        onAuthenticated?.();
      } else {
        setError(result.error || '인증에 실패했습니다.');
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [password, router, onAuthenticated]);

  // 모달 닫기
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPassword('');
    setError(null);
    // URL에서 admin 파라미터 제거
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('admin');
    router.replace(newUrl.pathname + newUrl.search);
  }, [router]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        {/* 헤더 */}
        <div className="mb-6">
          <h2
            className={cn(
              // typography
              "text-xl font-bold",
              // color
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            🔐 Admin 인증
          </h2>
          <p
            className={cn(
              // typography
              "text-sm mt-1",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            Hidden 포스트를 보려면 비밀번호를 입력하세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="admin-password"
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
              id="admin-password"
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

          {/* 에러 메시지 */}
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

          {/* 버튼 그룹 */}
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
