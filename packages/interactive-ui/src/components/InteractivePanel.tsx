'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';
import { motion, AnimatePresence } from 'framer-motion';

const PanelRoot = styled(motion.div, {
  backgroundColor: '$background',
  borderRadius: '$3',
  border: '1px solid $border',
  overflow: 'hidden',
});

const Header = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '$4',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  color: '$text',
  outline: 'none',
  
  '&:focus-visible': {
    backgroundColor: '$gray100',
  },
});

const Title = styled('span', {
  fontSize: '$3',
  fontWeight: 600,
});

const IconWrapper = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textSecondary',
});

const ContentWrapper = styled(motion.div, {
  overflow: 'hidden',
});

const Content = styled('div', {
  padding: '0 $4 $4 $4',
  color: '$textSecondary',
  fontSize: '$3',
  lineHeight: 1.6,
});

// Chevron Down Icon SVG
const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const InteractivePanel = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PanelRoot
      animate={{
        borderColor: isOpen ? 'var(--colors-primary)' : 'var(--colors-border)',
        boxShadow: isOpen ? '0 4px 12px rgba(37, 99, 235, 0.1)' : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.2 }}
    >
      <Header onClick={() => setIsOpen(!isOpen)}>
        <Title>{title}</Title>
        <IconWrapper
          animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? 'var(--colors-primary)' : 'var(--colors-textSecondary)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ChevronIcon />
        </IconWrapper>
      </Header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <ContentWrapper
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Content>{children}</Content>
          </ContentWrapper>
        )}
      </AnimatePresence>
    </PanelRoot>
  );
};
