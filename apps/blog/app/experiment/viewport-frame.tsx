"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

type ViewportFrameProps = {
  width: number | null;
  children: React.ReactNode;
};

export function ViewportFrame({ width, children }: ViewportFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(400);

  const setupIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // 문서 초기화
    doc.open();
    doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
    doc.close();

    // 부모 문서의 스타일시트 복사
    const parentStyles = document.querySelectorAll(
      'link[rel="stylesheet"], style'
    );
    parentStyles.forEach((style) => {
      const clone = style.cloneNode(true) as HTMLElement;
      doc.head.appendChild(clone);
    });

    // 기본 스타일 추가
    const baseStyle = doc.createElement("style");
    baseStyle.textContent = `
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow-x: hidden;
      }
      body {
        min-height: 100%;
      }
      #viewport-root {
        margin: 0;
        padding: 0;
      }
      /* 최상위 자식 요소의 상하 margin 리셋 */
      #viewport-root > * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
    `;
    doc.head.appendChild(baseStyle);

    // dark mode 클래스 동기화
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      doc.documentElement.classList.add("dark");
    }

    // mount 노드 생성
    const container = doc.createElement("div");
    container.id = "viewport-root";
    doc.body.appendChild(container);

    setMountNode(container);
  }, []);

  // iframe 초기화
  useEffect(() => {
    if (width === null) return;

    // 약간의 지연 후 초기화 (iframe이 DOM에 마운트된 후)
    const timer = setTimeout(setupIframe, 0);
    return () => clearTimeout(timer);
  }, [width, setupIframe]);

  // dark mode 변경 감지
  useEffect(() => {
    if (width === null) return;

    const observer = new MutationObserver(() => {
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      if (!doc) return;

      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        doc.documentElement.classList.add("dark");
      } else {
        doc.documentElement.classList.remove("dark");
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [width]);

  // iframe 높이 자동 조절
  useEffect(() => {
    if (!mountNode) return;

    const updateHeight = () => {
      const height = mountNode.scrollHeight;
      if (height > 0) {
        setIframeHeight(Math.max(height, 200));
      }
    };

    // 초기 높이 설정
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(mountNode);

    // MutationObserver도 추가하여 DOM 변경 감지
    const mutationObserver = new MutationObserver(updateHeight);
    mutationObserver.observe(mountNode, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [mountNode]);

  // Responsive 모드: iframe 없이 직접 렌더링
  if (width === null) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        /* Layout */
        "w-full flex justify-center",
        /* Background - 격자 패턴 */
        "bg-[length:20px_20px]",
        "bg-[linear-gradient(to_right,rgb(228,228,231)_1px,transparent_1px),linear-gradient(to_bottom,rgb(228,228,231)_1px,transparent_1px)]",
        "dark:bg-[linear-gradient(to_right,rgb(39,39,42)_1px,transparent_1px),linear-gradient(to_bottom,rgb(39,39,42)_1px,transparent_1px)]",
        /* Padding */
        "py-6",
        /* Border */
        "rounded-lg"
      )}
    >
      <div
        className={cn(
          /* Layout */
          "w-full",
          /* Background */
          "bg-white dark:bg-zinc-950",
          /* Border */
          "border border-zinc-200 dark:border-zinc-800",
          "rounded-lg shadow-lg",
          /* Overflow */
          "overflow-hidden"
        )}
        style={{ maxWidth: `${width}px` }}
      >
        <iframe
          ref={iframeRef}
          className="w-full border-0 block"
          style={{ height: `${iframeHeight}px` }}
          title="Preview"
        />
        {mountNode && createPortal(children, mountNode)}
      </div>
    </div>
  );
}
