import Link from "next/link";
import { cn } from "../../lib/utils";

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col",
        "bg-white dark:bg-slate-950"
      )}
    >
      <header 
        className={cn(
          "border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10",
          "bg-white border-gray-200",
          "dark:bg-slate-950 dark:border-slate-800"
        )}
      >
        <Link 
          href="/experiment" 
          className={cn(
            "font-bold text-xl",
            "text-gray-900 dark:text-gray-100"
          )}
        >
          🧪 Experiments
        </Link>
        <Link 
          href="/" 
          className={cn(
            "text-sm",
            "text-gray-500 hover:text-black",
            "dark:text-gray-400 dark:hover:text-white"
          )}
        >
          ← Back to Blog
        </Link>
      </header>
      <div 
        className={cn(
          "flex-1 relative",
          "bg-gray-50 dark:bg-slate-900"
        )}
      >
        {/* CSS Grid Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Content Area */}
        <div className="relative z-1 flex flex-col items-center justify-center min-h-[calc(100vh-65px)] p-8 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

