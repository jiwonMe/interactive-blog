"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { darkTheme } from "@repo/interactive-ui";

function StitchesThemeSync() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    // darkTheme object might be stringified to class name or accessed via .className
    const className = typeof darkTheme === 'string' 
      ? darkTheme 
      : (darkTheme as { className?: string }).className || 'dark-theme';
    
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add(className);
    } else {
      root.classList.remove(className);
    }
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <StitchesThemeSync />
      {children}
    </NextThemesProvider>
  );
}
