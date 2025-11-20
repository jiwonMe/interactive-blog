'use client';

import React, { useState, useRef } from 'react';
import { styled } from '../stitches.config';

const CodeBlockWrapper = styled('div', {
  position: 'relative',
  display: 'block',
  
  '&:hover': {
    '& button': {
      opacity: 1,
    },
  },
});

const Pre = styled('pre', {
  position: 'relative',
  margin: 0,
  backgroundColor: '$codeBackground',
  
  variants: {
    hasLineNumbers: {
      true: {
        paddingRight: '$10',
      },
    },
  },
});

const CopyButton = styled('button', {
  // layout
  position: 'absolute',
  top: '$3',
  right: '$3',
  padding: '$2',
  borderRadius: '$2',
  border: '1px solid $border',
  // interaction
  transition: 'all 0.2s',
  opacity: 0,
  cursor: 'pointer',
  outline: 'none',
  // styling
  backgroundColor: '$background',
  backdropFilter: 'blur(8px)',
  color: '$textSecondary',
  
  '&:hover': {
    backgroundColor: '$zinc100',
    color: '$text',
    opacity: 1,
  },
  
  '&:focus-visible': {
    opacity: 1,
    outline: '2px solid $primary',
    outlineOffset: '2px',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  // dark theme
  '.dark-theme &': {
    backgroundColor: '$zinc100',
    borderColor: '$zinc200',
    color: '$textSecondary',
    
    '&:hover': {
      backgroundColor: '$zinc200',
      color: '$text',
    },
  },
});

const IconWrapper = styled('div', {
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Copy Icon SVG
const CopyIcon = () => (
  <IconWrapper>
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
  </IconWrapper>
);

// Check Icon SVG
const CheckIcon = () => (
  <IconWrapper>
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </IconWrapper>
);

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  'data-line-numbers'?: string | boolean;
}

export const CodeBlock = ({ children, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    if (!preRef.current) return;

    const codeElement = preRef.current.querySelector('code');
    if (!codeElement) return;

    const text = codeElement.textContent || '';

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const hasLineNumbers =
    (props as any)['data-line-numbers'] !== undefined ||
    (typeof props.className === 'string' && props.className.includes('line-numbers'));

  return (
    <CodeBlockWrapper>
      <Pre ref={preRef} hasLineNumbers={hasLineNumbers} {...props}>
        {children}
      </Pre>
      <CopyButton
        onClick={copyToClipboard}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </CopyButton>
    </CodeBlockWrapper>
  );
};

