'use client';

import * as React from 'react';
import type { SearchIndex } from '../lib/search';
import { SearchCommandMenu } from './search/search-command-menu';
import { ReadingProgressBar } from './reading-progress-bar';
import { CodeUrlLineHighlighter } from './code-url-line-highlighter';

export type GlobalClientUIProps = {
  searchIndex: SearchIndex;
};

export function GlobalClientUI({ searchIndex }: GlobalClientUIProps) {
  return (
    <>
      <ReadingProgressBar />
      <CodeUrlLineHighlighter />
      <SearchCommandMenu searchIndex={searchIndex} />
    </>
  );
}

