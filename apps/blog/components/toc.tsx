"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";

export type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      toc.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [toc]);

  // active 항목이 변경될 때 자동 스크롤
  useEffect(() => {
    if (activeItemRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItemRef.current.getBoundingClientRect();
      
      // 항목이 화면 밖에 있으면 스크롤
      if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
        activeItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeId]);

  if (toc.length === 0) return null;

  return (
    <nav 
      ref={navRef}
      className={cn(
        // Layout
        "hidden lg:block w-64 ml-12 flex-shrink-0",
        // Sticky positioning
        "sticky self-start",
        // Position from top
        "top-24",
        // Height & Overflow
        "max-h-[calc(100vh-8rem)] overflow-y-auto",
        // Scrollbar styling
        "toc-scrollbar"
      )}
    >
      <h4 
        className={cn(
          // Typography
          "font-semibold text-sm uppercase tracking-wider mb-4",
          // Sticky header
          "sticky top-0 bg-zinc-100 dark:bg-zinc-950 py-2 -mt-2 z-10",
          // Colors
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        On this page
      </h4>
      <ul 
        className={cn(
          // Layout
          "space-y-2 text-sm pb-4",
          // Border
          "border-l border-zinc-100 dark:border-zinc-800"
        )}
      >
        {toc.map((item) => (
          <li key={item.id}>
            <a
              ref={activeId === item.id ? activeItemRef : null}
              href={`#${item.id}`}
              className={cn(
                // Base
                "block py-1 transition-colors border-l-2 -ml-[1px]",
                // Active state
                activeId === item.id
                  ? "border-blue-600 text-blue-600 font-medium dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-600"
              )}
              style={{ paddingLeft: `${(item.level - 1) * 1 + 1}rem` }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

