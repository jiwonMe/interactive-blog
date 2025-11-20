import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  title: "Interactive Tech Blog",
  description: "A blog with interactive components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          // base
          "bg-white text-gray-900 antialiased min-h-screen flex flex-col",
          // selection
          "selection:bg-blue-100 selection:text-blue-900",
          // dark mode
          "dark:bg-slate-950 dark:text-slate-50 dark:selection:bg-blue-900 dark:selection:text-blue-100"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-slate-950/80">
            <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
              <a href="/" className="font-bold text-xl hover:text-blue-600 transition-colors dark:hover:text-blue-400">
                Interactive Blog
              </a>
              <ThemeToggle />
            </div>
          </header>
          
          <div className="flex-1">
            {children}
          </div>
          
          <footer className="border-t border-gray-100 py-12 mt-20 dark:border-gray-800">
            <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">Interactive Tech Blog</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors dark:hover:text-white">
                  GitHub
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors dark:hover:text-white">
                  Twitter
                </a>
                <span className="w-px h-3 bg-gray-200 hidden md:block dark:bg-gray-700"></span>
                <span className="text-gray-400 dark:text-gray-500">Built with Next.js & Stitches</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
