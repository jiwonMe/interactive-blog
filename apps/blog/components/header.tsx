"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Experiments", href: "/experiment" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
              ? "border-b bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 border-gray-200 dark:border-gray-800"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className={cn(
            "font-bold text-xl tracking-tight transition-colors flex items-center gap-2",
            "text-gray-900 dark:text-gray-100",
            "hover:text-blue-600 dark:hover:text-blue-400"
          )}
        >
          <span>Interactive Blog</span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-1",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
             <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

