'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';

const PanelRoot = styled('div', {
  backgroundColor: '$background',
  borderRadius: '$3',
  border: '1px solid $border',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  variants: {
    active: {
      true: {
        borderColor: '$primary',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
      },
      false: {
        '&:hover': {
          borderColor: '$gray300',
        }
      }
    },
  },
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

const IconWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textSecondary',
  transition: 'transform 0.3s cubic-bezier(0.87, 0, 0.13, 1)',
  
  variants: {
    open: {
      true: { transform: 'rotate(180deg)', color: '$primary' },
      false: { transform: 'rotate(0deg)' },
    },
  },
});

const ContentWrapper = styled('div', {
  height: 0,
  overflow: 'hidden',
  transition: 'height 0.3s cubic-bezier(0.87, 0, 0.13, 1)',
  
  variants: {
    open: {
      true: { height: 'auto' },
    },
  },
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
    <PanelRoot active={isOpen}>
      <Header onClick={() => setIsOpen(!isOpen)}>
        <Title>{title}</Title>
        <IconWrapper open={isOpen}>
          <ChevronIcon />
        </IconWrapper>
      </Header>
      <ContentWrapper open={isOpen}>
        <Content>{children}</Content>
      </ContentWrapper>
    </PanelRoot>
  );
};
