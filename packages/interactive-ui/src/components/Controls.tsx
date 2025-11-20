import React from 'react';
import { styled } from '../stitches.config';

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginTop: '1rem',
  
  '@media (min-width: 640px)': {
    gap: '1rem',
  },
});

const Group = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  
  '@media (min-width: 640px)': {
    gap: '1rem',
  },
});

const StyledButton = styled('button', {
  padding: '0.75rem',
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '@media (min-width: 640px)': {
    padding: '0.5rem',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$text',
        color: '$background',
        '&:hover': {
          opacity: 0.9,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '$text',
        '&:hover': {
          backgroundColor: '$hover',
        },
      },
    },
  },
  
  defaultVariants: {
    variant: 'secondary',
  },
});

const SliderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'center',
  
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
});

const SliderLabel = styled('span', {
  fontSize: '0.875rem',
  color: '$muted',
  fontWeight: 500,
  minWidth: '3rem',
  textAlign: 'right',
});

const SliderInput = styled('input', {
  width: '100%',
  height: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: '$border',
  appearance: 'none',
  cursor: 'pointer',
  outline: 'none',

  '@media (min-width: 640px)': {
    width: '8rem',
  },

  '&::-webkit-slider-thumb': {
    appearance: 'none',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: '$text',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});

export interface SliderProps extends React.ComponentProps<'input'> {
  label?: string;
  // Stitches css prop support
  css?: React.ComponentProps<typeof SliderInput>['css'];
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ label, css, ...props }, ref) => {
    return (
      <SliderContainer>
        {label && <SliderLabel>{label}</SliderLabel>}
        <SliderInput ref={ref} type="range" css={css} {...props} />
      </SliderContainer>
    );
  }
);

Slider.displayName = 'Controls.Slider';

export const Controls = {
  Root,
  Group,
  Button: StyledButton,
  Slider,
};
