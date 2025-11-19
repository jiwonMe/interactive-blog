"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

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

  if (toc.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-24 self-start w-64 ml-12 max-h-[calc(100vh-6rem)] overflow-auto">
      <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">On this page</h4>
      <ul className="space-y-2 text-sm border-l border-gray-100">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block pl-4 py-1 transition-colors border-l-2 -ml-[1px]",
                activeId === item.id
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
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

