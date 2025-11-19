'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';

const Panel = styled('div', {
  backgroundColor: '$gray100',
  borderRadius: '$2',
  padding: '$3',
  border: '1px solid $gray300',
  transition: 'all 0.2s ease',
  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
        color: 'white',
        borderColor: '$primary',
      },
    },
  },
});

const Title = styled('h3', {
  margin: '0 0 $2 0',
  fontSize: '1.2rem',
});

const Content = styled('div', {
  fontSize: '1rem',
});

export const InteractivePanel = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Panel active={isActive} onClick={() => setIsActive(!isActive)} style={{ cursor: 'pointer' }}>
      <Title>{title}</Title>
      <Content>{children}</Content>
      <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
        {isActive ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
      </div>
    </Panel>
  );
};

