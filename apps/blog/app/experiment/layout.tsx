import Link from "next/link";

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/experiment" className="font-bold text-xl">
          🧪 Experiments
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-black">
          ← Back to Blog
        </Link>
      </header>
      <div className="flex-1 bg-gray-50 relative">
        {/* CSS Grid Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Content Area */}
        <div className="relative z-1 flex flex-col items-center justify-center min-h-[calc(100vh-65px)] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

