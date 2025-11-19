'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$3',
  padding: '$4',
  border: '1px dashed $gray300',
  borderRadius: '$2',
});

const Button = styled('button', {
  padding: '$2 $3',
  backgroundColor: '$primary',
  color: 'white',
  border: 'none',
  borderRadius: '$1',
  cursor: 'pointer',
  fontSize: '1rem',
  '&:hover': {
    opacity: 0.9,
  },
});

const Display = styled('div', {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '$text',
});

export const Playground = () => {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Display>{count}</Display>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setCount(count - 1)}>-</Button>
        <Button onClick={() => setCount(count + 1)}>+</Button>
      </div>
      <div>Interactive Playground Demo</div>
    </Container>
  );
};

