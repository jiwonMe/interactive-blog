"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { PwnzLogo } from "./pwnz-logo";

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
    ...(process.env.NODE_ENV === "development"
      ? [{ name: "Experiments", href: "/experiment" }]
      : []),
  ];

  return (
    <header
      className={cn(
        /* Layout & Position */
        "sticky top-0 z-50 w-full",
        /* Transition */
        "transition-all duration-300",
        /* Scroll State Styles */
        "border-b bg-gray-50/80 backdrop-blur-md border-gray-200 dark:bg-zinc-950/80 dark:border-gray-800"
      )}
    >
      <div
        className={cn(
          /* Layout & Sizing */
          "mx-auto h-16 flex items-center justify-between",
          /* Spacing */
          "px-6"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            /* Layout & Flex */
            "flex items-center gap-2",
            /* Typography */
            "font-bold text-xl tracking-tight",
            /* Colors & Transition */
            "text-gray-900 transition-colors dark:text-gray-100",
            /* Hover States */
            "hover:text-blue-600 dark:hover:text-blue-400"
          )}
        >
          <PwnzLogo />
        </Link>

        {/* Navigation & Actions */}
        <div className={cn(/* Layout */ "flex items-center gap-6")}>
          <nav
            className={cn(
              /* Layout */
              "hidden sm:flex items-center gap-6"
            )}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    /* Typography */
                    "text-sm font-medium relative",
                    /* Spacing */
                    "py-1",
                    /* Transition */
                    "transition-colors",
                    /* Active/Inactive Colors */
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={cn(
                        /* Positioning */
                        "absolute -bottom-[19px] left-0 right-0",
                        /* Size */
                        "h-[2px]",
                        /* Color */
                        "bg-blue-600 dark:bg-blue-400"
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              /* Layout */
              "flex items-center gap-3",
              /* Spacing */
              "pl-6",
              /* Borders */
              "border-l border-gray-200 dark:border-gray-800"
            )}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                /* Colors */
                "text-gray-500 dark:text-gray-400",
                /* Hover Colors */
                "hover:text-gray-900 dark:hover:text-gray-200",
                /* Transition */
                "transition-colors"
              )}
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
