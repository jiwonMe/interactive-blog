'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { CitationFormat, generateCitation } from '../lib/bibtex';
import { PostData } from '../lib/posts';
import { trackCitationCopy } from '../lib/analytics';

interface CitationCopyButtonProps {
  bibtex: string;
  post: PostData;
  className?: string;
  children?: React.ReactNode;
}

const citationFormats: { format: CitationFormat; label: string }[] = [
  { format: 'apa', label: 'APA' },
  { format: 'mla', label: 'MLA' },
  { format: 'chicago', label: 'Chicago' },
  { format: 'harvard', label: 'Harvard' },
  { format: 'ieee', label: 'IEEE' },
];

export function BibTeXCopyButton({ bibtex, post, className, children }: CitationCopyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<'bibtex' | CitationFormat | null>(null);
  const [hoveredType, setHoveredType] = useState<'bibtex' | CitationFormat | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ top: number; left: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoveredButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const updatePreviewPosition = () => {
      if (hoveredButtonRef.current && hoveredType) {
        const rect = hoveredButtonRef.current.getBoundingClientRect();
        setPreviewPosition({
          top: rect.top + window.scrollY,
          left: rect.right + window.scrollX + 8,
        });
      } else {
        setPreviewPosition(null);
      }
    };

    if (hoveredType) {
      updatePreviewPosition();
      window.addEventListener('scroll', updatePreviewPosition, true);
      window.addEventListener('resize', updatePreviewPosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePreviewPosition, true);
      window.removeEventListener('resize', updatePreviewPosition);
    };
  }, [hoveredType]);

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (buttonRef.current && showTooltip && !isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + window.scrollY - 8,
          left: rect.left + window.scrollX + rect.width / 2,
        });
      } else {
        setTooltipPosition(null);
      }
    };

    if (showTooltip && !isOpen) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition, true);
      window.addEventListener('resize', updateTooltipPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [showTooltip, isOpen]);

  const copyToClipboard = async (text: string, type: 'bibtex' | CitationFormat) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setIsOpen(false);
      setTimeout(() => setCopiedType(null), 2000);
      
      // GA4 이벤트 전송
      trackCitationCopy(post.slug, type);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      {children ? (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            // Base styles
            "inline cursor-pointer",
            // Dashed underline
            "border-b border-dashed border-zinc-400 dark:border-zinc-600",
            // Highlight effect on hover (green highlighter)
            "hover:bg-green-200/40 dark:hover:bg-green-900/40",
            "hover:border-green-400 dark:hover:border-green-600",
            // Transition
            "transition-all duration-150",
            // Padding for highlight effect
            "px-1 -mx-1 rounded-sm"
          )}
          aria-label="Copy citation"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {children}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            // Base button styles
            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all",
            // Colors
            "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
            "dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300",
            // Border
            "border border-zinc-200 dark:border-zinc-700",
            // Focus
            // "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "dark:focus:ring-offset-zinc-900"
          )}
          aria-label="Copy citation"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span>인용</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform",
              isOpen && "rotate-180"
            )}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            // Positioning
            "absolute top-full left-0 mt-1 z-50",
            // Container styles
            "min-w-[180px] rounded-md shadow-lg border",
            // Colors
            "bg-white dark:bg-zinc-800",
            "border-zinc-200 dark:border-zinc-700",
            // Animation
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <div className="py-1">
            <button
              ref={(el) => {
                if (hoveredType === 'bibtex') {
                  hoveredButtonRef.current = el;
                }
              }}
              onClick={() => copyToClipboard(bibtex, 'bibtex')}
              onMouseEnter={() => setHoveredType('bibtex')}
              onMouseLeave={() => {
                setHoveredType(null);
                hoveredButtonRef.current = null;
              }}
              className={cn(
                // Layout
                "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                // Colors
                "text-zinc-700 dark:text-zinc-300",
                "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                // Transition
                "transition-colors"
              )}
            >
              {copiedType === 'bibtex' ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>BibTeX 복사됨</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>BibTeX 복사</span>
                </>
              )}
            </button>
            
            <div className={cn(
              // Divider
              "border-t my-1",
              "border-zinc-200 dark:border-zinc-700"
            )} />
            
            {citationFormats.map(({ format, label }) => {
              const citationText = generateCitation(post, format);
              const isCopied = copiedType === format;
              
              return (
                <button
                  key={format}
                  ref={(el) => {
                    if (hoveredType === format) {
                      hoveredButtonRef.current = el;
                    }
                  }}
                  onClick={() => copyToClipboard(citationText, format)}
                  onMouseEnter={() => setHoveredType(format)}
                  onMouseLeave={() => {
                    setHoveredType(null);
                    hoveredButtonRef.current = null;
                  }}
                  className={cn(
                    // Layout
                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                    // Colors
                    "text-zinc-700 dark:text-zinc-300",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                    // Transition
                    "transition-colors"
                  )}
                >
                  {isCopied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600 dark:text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{label} 복사됨</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span>{label}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {hoveredType && previewPosition && typeof window !== 'undefined' && createPortal(
        <div
          className={cn(
            // Positioning
            "fixed z-[100]",
            // Hide on mobile, show on medium screens and up
            "hidden md:block",
            // Container styles
            "w-80 p-3 rounded-md shadow-lg border",
            // Colors
            "bg-white dark:bg-zinc-800",
            "border-zinc-200 dark:border-zinc-700",
            // Text
            "text-xs font-mono whitespace-pre-wrap break-words",
            "text-zinc-700 dark:text-zinc-300",
            // Animation
            "animate-in fade-in-0 zoom-in-95"
          )}
          style={{
            top: `${previewPosition.top}px`,
            left: `${previewPosition.left}px`,
          }}
        >
          {hoveredType === 'bibtex' ? bibtex : generateCitation(post, hoveredType)}
        </div>,
        document.body
      )}
      
      {showTooltip && tooltipPosition && !isOpen && typeof window !== 'undefined' && createPortal(
        <div
          className={cn(
            // Positioning
            "fixed z-[100]",
            // Container styles
            "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
            // Colors
            "bg-zinc-900 dark:bg-zinc-100",
            "text-zinc-100 dark:text-zinc-900",
            // Shadow
            "shadow-lg",
            // Animation
            "animate-in fade-in-0 zoom-in-95"
          )}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          인용 형식 복사
          <div
            className={cn(
              // Arrow pointing down
              "absolute top-full left-1/2 -translate-x-1/2",
              "w-0 h-0 border-l-4 border-r-4 border-t-4",
              "border-l-transparent border-r-transparent",
              "border-t-zinc-900 dark:border-t-zinc-100"
            )}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

