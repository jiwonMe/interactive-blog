'use client';

import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import { logoutAdmin } from '../../lib/admin';

interface AdminBadgeProps {
  className?: string;
}

export function AdminBadge({ className }: AdminBadgeProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  return (
    <div
      className={cn(
        // layout
        "inline-flex items-center gap-2",
        // padding
        "px-3 py-1.5",
        // background
        "bg-amber-100 dark:bg-amber-900/50",
        // border
        "border border-amber-300 dark:border-amber-700",
        // radius
        "rounded-full",
        className
      )}
    >
      <span
        className={cn(
          // typography
          "text-xs font-medium",
          // color
          "text-amber-800 dark:text-amber-300"
        )}
      >
        🔓 Admin Mode
      </span>
      <button
        onClick={handleLogout}
        className={cn(
          // typography
          "text-xs font-medium",
          // color
          "text-amber-600 dark:text-amber-400",
          // hover
          "hover:text-amber-800 dark:hover:text-amber-200",
          // underline
          "hover:underline",
          // transition
          "transition-colors"
        )}
      >
        로그아웃
      </button>
    </div>
  );
}
