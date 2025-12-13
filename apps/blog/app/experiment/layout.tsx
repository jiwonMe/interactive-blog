import { cn } from "../../lib/utils";

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className={cn(
        /* 레이아웃 */
        "min-h-screen flex flex-col",
        /* 배경 */
        "bg-white dark:bg-zinc-950"
      )}
    >
      <div 
        className={cn(
          /* 레이아웃 */
          "flex-1 relative",
          /* 배경 */
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        {/* CSS Grid Pattern Background */}
        <div 
          className={cn(
            /* 레이아웃 */
            "absolute inset-0 z-0 pointer-events-none",
            /* 투명도 */
            "opacity-[0.03] dark:opacity-[0.05]"
          )}
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Content Area */}
        <div
          className={cn(
            /* 레이아웃 */
            "relative z-10 w-full",
            "flex flex-col items-stretch justify-start",
            "min-h-[calc(100vh-65px)]",
            "px-4 py-8 md:px-8",
            /* 텍스트 */
            "text-zinc-900 dark:text-zinc-100"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

