'use client';

import React, { useState } from 'react';
import { styled } from '../stitches.config';
import { motion, AnimatePresence } from 'framer-motion';

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
  position: 'relative',
  minWidth: '120px',
});

const ValueWrapper = styled('div', {
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
});

const Value = styled(motion.div, {
  fontSize: '3rem',
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  color: '$text',
  lineHeight: 1,
  position: 'absolute',
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

const Button = styled(motion.button, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '48px',
  height: '48px',
  padding: '0 $4',
  backgroundColor: '$zinc100',
  color: '$text',
  border: '1px solid transparent',
  borderRadius: '$2',
  cursor: 'pointer',
  fontSize: '$4',
  fontWeight: 600,
  outline: 'none',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$textSecondary',
        height: '32px',
        fontSize: '$2',
      },
      default: {
        backgroundColor: '$zinc100',
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export const Playground = () => {
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleCount = (diff: number) => {
    setDirection(diff > 0 ? 1 : -1);
    setCount(c => c + diff);
  };

  const handleReset = () => {
    setDirection(count > 0 ? -1 : 1);
    setCount(0);
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <Container>
      <CounterDisplay>
        <ValueWrapper>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <Value
              key={count}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {count}
            </Value>
          </AnimatePresence>
        </ValueWrapper>
        <Label>Counter Value</Label>
      </CounterDisplay>
      
      <ButtonGroup>
        <Button
          variant="default"
          onClick={() => handleCount(-1)}
          whileHover={{ scale: 1.05, backgroundColor: 'var(--colors-zinc200)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Decrease"
        >
          −
        </Button>
        <Button
          variant="primary"
          onClick={() => handleCount(1)}
          whileHover={{ scale: 1.05, backgroundColor: 'var(--colors-primaryHover)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Increase"
        >
          +
        </Button>
      </ButtonGroup>
      
      <Button
        variant="ghost"
        onClick={handleReset}
        whileHover={{ backgroundColor: 'var(--colors-zinc100)', color: 'var(--colors-text)' }}
        whileTap={{ scale: 0.95 }}
      >
        Reset
      </Button>
    </Container>
  );
};
