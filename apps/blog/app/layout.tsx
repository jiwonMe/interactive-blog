import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ko" className="scroll-smooth">
      <body className="bg-white text-gray-900 antialiased min-h-screen selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        
        <footer className="border-t border-gray-100 py-12 mt-20">
          <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-900">Interactive Tech Blog</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                Twitter
              </a>
              <span className="w-px h-3 bg-gray-200 hidden md:block"></span>
              <span className="text-gray-400">Built with Next.js & Stitches</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

