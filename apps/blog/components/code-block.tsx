"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";

export function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    if (!preRef.current) return;

    const codeElement = preRef.current.querySelector("code");
    if (!codeElement) return;

    const text = codeElement.textContent || "";
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      <pre
        ref={preRef}
        {...props}
        className={cn(
          props.className,
          "relative"
        )}
      >
        {children}
      </pre>
      <button
        onClick={copyToClipboard}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-md border transition-all opacity-0 group-hover:opacity-100",
          "bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white",
          "dark:bg-slate-800/80 dark:border-slate-700 dark:hover:bg-slate-800",
          "text-gray-600 hover:text-gray-900",
          "dark:text-gray-400 dark:hover:text-gray-200",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

