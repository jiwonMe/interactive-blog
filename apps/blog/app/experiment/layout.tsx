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
        "bg-white dark:bg-zinc-950"
      )}
    >
      <div 
        className={cn(
          "flex-1 relative",
          "bg-zinc-50 dark:bg-zinc-900"
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
        <div className="relative z-1 flex flex-col items-center justify-center min-h-[calc(100vh-65px)] p-8 text-zinc-900 dark:text-zinc-100">
          {children}
        </div>
      </div>
    </div>
  );
}

