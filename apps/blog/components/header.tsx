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

  // main 페이지에서는 header를 숨김
  if (pathname === "/") {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/" },
    ...(process.env.NODE_ENV === "development"
      ? [{ name: "Experiments", href: "/experiment" }]
      : []),
  ];

  return (
    <header
      className={cn(
        /* Layout & Position - Mobile: fixed bottom, Desktop: sticky top */
        "fixed bottom-0 left-0 right-0",
        "sm:sticky sm:top-0 sm:bottom-auto",
        "z-50 w-full",
        /* Transition */
        "transition-all duration-300",
        /* Scroll State Styles */
        isScrolled
          ? "border-t sm:border-b sm:border-t-0 bg-zinc-100/80 backdrop-blur-md border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800"
          : "bg-zinc-100 dark:bg-zinc-950 border-dashed border-t sm:border-b sm:border-t-0 border-zinc-300 dark:border-zinc-700"
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
            "text-zinc-900 transition-colors dark:text-zinc-100",
            /* Hover States */
            "hover:text-blue-600 dark:hover:text-blue-400",
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
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
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
            )}
          >
            <ThemeToggle className="border-none"/>
          </div>
        </div>
      </div>
    </header>
  );
}
