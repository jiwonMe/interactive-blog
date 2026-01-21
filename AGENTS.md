# AGENTS.md - Interactive Blog Monorepo

> Guidelines for AI agents working in this Next.js 16 + Turborepo codebase.

## Project Structure

```
interactive-blog/
├── apps/blog/                    # Next.js 16 blog application
│   ├── app/                      # App Router pages
│   ├── articles/                 # MDX content with article-specific components
│   │   └── {slug}/
│   │       ├── content.mdx
│   │       └── components/       # Article-specific interactive components
│   ├── components/               # Shared React components
│   ├── lib/                      # Utilities and helpers
│   └── public/images/articles/   # Article images
├── packages/
│   ├── interactive-ui/           # Stitches-based UI primitives
│   ├── interactive-components/   # Vanilla-extract chart/control components
│   ├── eslint-config/            # Shared ESLint configuration
│   └── tsconfig/                 # Shared TypeScript configs
└── turbo.json                    # Turborepo task configuration
```

## Build/Lint/Test Commands

```bash
# From repository root
pnpm install                      # Install dependencies
pnpm dev                          # Start dev server (Turbo)
pnpm build                        # Production build
pnpm lint                         # Run ESLint across all packages
pnpm format                       # Run Prettier on all TS/TSX/MD files

# From apps/blog
pnpm dev                          # Next.js dev server
pnpm build                        # Next.js production build
pnpm lint                         # Next.js lint
pnpm start                        # Start production server

# From packages/interactive-components
pnpm build                        # tsup build
pnpm dev                          # tsup watch mode
pnpm lint                         # ESLint

# No test suite configured - no test commands available
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: Enabled (`"strict": true`)
- **Module resolution**: `bundler`
- **Target**: ES5 for Next.js, ESNext for libraries
- Never use `as any`, `@ts-ignore`, or `@ts-expect-error`

### Import Patterns

```typescript
// External imports first
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Workspace packages with @repo alias
import { InteractivePanel, Playground } from "@repo/interactive-ui";
import { BarChart, LineChart } from "@repo/interactive-components";

// Relative imports last
import { cn } from "../lib/utils";
import { ThemeToggle } from "./theme-toggle";
```

### Naming Conventions

| Element            | Convention                         | Example                                       |
| ------------------ | ---------------------------------- | --------------------------------------------- |
| Components         | PascalCase                         | `TableOfContents`, `ThemeToggle`              |
| Files (components) | kebab-case                         | `theme-toggle.tsx`, `search-command-menu.tsx` |
| Files (articles)   | kebab-case dirs                    | `articles/text-editor-data-structures/`       |
| Hooks              | camelCase with `use` prefix        | `useImageUpload`, `useGapBuffer`              |
| Utility functions  | camelCase                          | `formatDate`, `extractTOC`                    |
| Types/Interfaces   | PascalCase with descriptive suffix | `TOCItem`, `PostData`, `SliderProps`          |
| Constants          | UPPER_SNAKE_CASE                   | `KNOWN_CITATIONS`                             |

### Component Patterns

```typescript
// Client components - add directive at top
"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

// Export type separately for reuse
export type TOCItem = {
  id: string;
  text: string;
  level: number;
};

interface TableOfContentsProps {
  toc: TOCItem[];
  articleSlug?: string;
}

// Named exports preferred
export function TableOfContents({ toc, articleSlug }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  // ...
}
```

### Styling Approach

**Primary: Tailwind CSS with `cn()` utility**

```typescript
import { cn } from '../lib/utils';

<div
  className={cn(
    /* Layout & Position */
    'fixed bottom-0 left-0 right-0',
    'sm:sticky sm:top-0',
    /* Spacing */
    'px-4 sm:px-6',
    /* Colors */
    'bg-zinc-100 dark:bg-zinc-950',
    /* Transition */
    'transition-all duration-300',
    /* Conditional styles */
    isActive && 'text-blue-600 dark:text-blue-400'
  )}
>
```

**Secondary: Stitches (interactive-ui package)**

```typescript
import { styled } from "../stitches.config";

const StyledButton = styled("button", {
  padding: "0.75rem",
  borderRadius: "9999px",
  variants: {
    variant: {
      primary: { backgroundColor: "$text" },
      secondary: { backgroundColor: "transparent" },
    },
  },
});
```

### Dark Mode

- Uses `next-themes` with class strategy (`darkMode: "class"`)
- Always provide dark variants: `text-zinc-800 dark:text-zinc-300`
- CSS variables defined in Stitches for consistent theming

### Client vs Server Components

- Default to Server Components (no directive needed)
- Add `'use client';` only when using:
  - React hooks (`useState`, `useEffect`, etc.)
  - Browser APIs (`window`, `document`)
  - Event handlers
  - Third-party client libraries

### Error Handling

- Never use empty catch blocks
- Provide meaningful error messages
- Use optional chaining for potentially undefined values

```typescript
// Good
const element = document.getElementById(item.id);
if (element) observer.observe(element);

// Good - null check with fallback
const password = passwordValue.length > 0 ? passwordValue : undefined;
```

### Type Exports

```typescript
// Export types alongside components
export type { SliderProps } from "./Controls";
export type { CodeBlockProps } from "./CodeBlock";
```

## Package-Specific Guidelines

### apps/blog

- Next.js 16 with App Router
- MDX for blog content via `next-mdx-remote`
- Tailwind CSS for styling
- Article-specific components go in `articles/{slug}/components/`

### packages/interactive-ui

- Stitches-based styling
- Exports: `InteractivePanel`, `Playground`, `Controls`, `CodeBlock`, etc.
- Uses CSS variables for dark mode compatibility

### packages/interactive-components

- Vanilla-extract for styling
- Chart components: `LineChart`, `BarChart`, `ScatterPlot`, `AreaChart`
- Control primitives: `Button`, `Slider`, `Select`, `Toggle`, `NumberInput`
- Uses Recharts and Visx for data visualization

## MDX Component Registration

Article-specific components are registered in:
`apps/blog/components/mdx-components/article-components-registry.ts`

Base MDX components are in:
`apps/blog/components/mdx-components/base-components.tsx`

## Key Dependencies

| Package              | Version                             | Purpose                                   |
| -------------------- | ----------------------------------- | ----------------------------------------- |
| next                 | 16.0.10                             | React framework                           |
| react                | ^19.0.0                             | UI library                                |
| tailwindcss          | ^3.4.0                              | Utility-first CSS                         |
| @stitches/react      | -                                   | CSS-in-JS (interactive-ui)                |
| @vanilla-extract/css | ^1.0.0                              | Zero-runtime CSS (interactive-components) |
| framer-motion        | ^11.0.0 (blog) / ^12.x (components) | Animation                                 |
| next-mdx-remote      | ^5.0.0                              | MDX rendering                             |
| recharts             | ^2.0.0                              | Charts                                    |

## Common Patterns

### Utility Function: `cn()`

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### forwardRef Components

```typescript
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn('...', className)} {...props} />;
  }
);
```

### ISR Configuration

```typescript
// For pages that need revalidation
export const revalidate = 3600; // 1 hour in seconds
```
