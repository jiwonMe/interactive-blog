'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  padding: '$8',
  backgroundColor: '$background',
  border: '1px solid $border',
  borderRadius: '$3',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
});

const CounterDisplay = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '$2',
});

const Value = styled('div', {
  fontSize: '3rem',
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  color: '$text',
  lineHeight: 1,
});

const Label = styled('div', {
  fontSize: '$2',
  color: '$textSecondary',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '$2',
});

const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$3',
});

const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '48px',
  height: '48px',
  padding: '0 $4',
  backgroundColor: '$gray100',
  color: '$text',
  border: '1px solid transparent',
  borderRadius: '$2',
  cursor: 'pointer',
  fontSize: '$4',
  fontWeight: 600,
  transition: 'all 0.2s',
  
  '&:hover': {
    backgroundColor: '$gray200',
    transform: 'translateY(-1px)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
    backgroundColor: '$gray300',
  },
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        '&:hover': {
          backgroundColor: '$primaryHover',
        },
        '&:active': {
          backgroundColor: '$primaryHover',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$textSecondary',
        height: '32px',
        fontSize: '$2',
        '&:hover': {
          backgroundColor: '$gray100',
          color: '$text',
        },
      }
    }
  }
});

export const Playground = () => {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <CounterDisplay>
        <Value>{count}</Value>
        <Label>Counter Value</Label>
      </CounterDisplay>
      
      <ButtonGroup>
        <Button onClick={() => setCount(c => c - 1)} aria-label="Decrease">
          −
        </Button>
        <Button variant="primary" onClick={() => setCount(c => c + 1)} aria-label="Increase">
          +
        </Button>
      </ButtonGroup>
      
      <Button variant="ghost" onClick={() => setCount(0)}>
        Reset
      </Button>
    </Container>
  );
};
