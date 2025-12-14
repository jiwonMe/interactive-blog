import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const fieldRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const fieldLabel = style({
  fontSize: vars.font.sizeSm,
  fontWeight: 600,
  color: vars.color.textMuted,
});

export const fieldHelp = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.textMuted,
});

export const inputBase = style({
  width: '100%',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  color: vars.color.text,
  fontSize: vars.font.sizeMd,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:focus-visible': {
      borderColor: vars.color.accent,
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.accent} 20%, transparent)`,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const button = recipe({
  base: {
    // 블로그 스타일: rounded-md
    borderRadius: vars.radius.md,
    border: '1px solid transparent',
    padding: `${vars.space[2]} ${vars.space[4]}`,
    fontSize: vars.font.sizeMd,
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    // 블로그 스타일: transition-colors
    transition: 'background-color 150ms ease, color 150ms ease',
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.accent}`,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    variant: {
      // 블로그 스타일: bg-zinc-900 (라이트), bg-zinc-100 (다크)
      primary: {
        background: vars.color.buttonPrimaryBg,
        borderColor: vars.color.buttonPrimaryBg,
        color: vars.color.buttonPrimaryText,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.buttonPrimaryHover,
          },
        },
      },
      // 블로그 스타일: bg-zinc-200 (라이트), bg-zinc-800 (다크)
      secondary: {
        background: vars.color.buttonSecondaryBg,
        borderColor: vars.color.buttonSecondaryBg,
        color: vars.color.buttonSecondaryText,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.buttonSecondaryHover,
          },
        },
      },
      // 고스트 버튼
      ghost: {
        background: 'transparent',
        borderColor: 'transparent',
        color: vars.color.text,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.surface,
          },
        },
      },
    },
    size: {
      sm: {
        padding: `${vars.space[1]} ${vars.space[2]}`,
        fontSize: vars.font.sizeSm,
      },
      md: {
        padding: `${vars.space[2]} ${vars.space[4]}`,
        fontSize: vars.font.sizeMd,
      },
    },
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'md',
  },
});

export const sliderTrack = style({
  width: '100%',
  height: '6px',
  borderRadius: vars.radius.full,
  background: vars.color.border,
  appearance: 'none',
  outline: 'none',
  selectors: {
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: '16px',
      height: '16px',
      borderRadius: '9999px',
      background: vars.color.buttonPrimaryBg,
      border: 'none',
      boxShadow: vars.shadow.sm,
      cursor: 'pointer',
    },
    '&::-moz-range-thumb': {
      width: '16px',
      height: '16px',
      borderRadius: '9999px',
      background: vars.color.buttonPrimaryBg,
      border: 'none',
      boxShadow: vars.shadow.sm,
      cursor: 'pointer',
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.accent} 20%, transparent)`,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// Radix Slider (블로그 스타일)
export const radixSliderRoot = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '24px',
});

export const radixSliderTrack = style({
  position: 'relative',
  flexGrow: 1,
  height: '6px',
  borderRadius: vars.radius.full,
  background: vars.color.border,
  overflow: 'hidden',
});

export const radixSliderRange = style({
  position: 'absolute',
  height: '100%',
  background: vars.color.buttonPrimaryBg,
});

export const radixSliderThumb = style({
  display: 'block',
  width: '16px',
  height: '16px',
  borderRadius: vars.radius.full,
  background: vars.color.buttonPrimaryBg,
  border: 'none',
  boxShadow: vars.shadow.sm,
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.accent}`,
    },
    '&[data-disabled]': {
      opacity: 0.5,
    },
  },
});

export const toggleRoot = recipe({
  base: {
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: vars.radius.full,
    border: `1px solid ${vars.color.border}`,
    background: vars.color.surfaceAlt,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 150ms ease, border-color 150ms ease',
    selectors: {
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.accent}`,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    checked: {
      true: {
        background: vars.color.buttonPrimaryBg,
        borderColor: vars.color.buttonPrimaryBg,
      },
      false: {},
    },
  },
});

export const toggleThumb = recipe({
  base: {
    position: 'absolute',
    top: '50%',
    width: '18px',
    height: '18px',
    borderRadius: vars.radius.full,
    background: vars.color.background,
    boxShadow: vars.shadow.sm,
    transform: 'translate(2px, -50%)',
    transition: 'transform 150ms ease',
  },
  variants: {
    checked: {
      true: {
        transform: 'translate(22px, -50%)',
      },
      false: {},
    },
  },
});

// Radix Switch (블로그 스타일)
export const radixSwitchRoot = style({
  position: 'relative',
  width: '44px',
  height: '24px',
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceAlt,
  cursor: 'pointer',
  outline: 'none',
  transition: 'background 150ms ease, border-color 150ms ease',
  selectors: {
    '&[data-state="checked"]': {
      background: vars.color.buttonPrimaryBg,
      borderColor: vars.color.buttonPrimaryBg,
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.accent}`,
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const radixSwitchThumb = style({
  position: 'absolute',
  top: '50%',
  width: '18px',
  height: '18px',
  borderRadius: vars.radius.full,
  background: vars.color.background,
  boxShadow: vars.shadow.sm,
  transform: 'translate(2px, -50%)',
  transition: 'transform 150ms ease',
  selectors: {
    '[data-state="checked"] &': {
      transform: 'translate(22px, -50%)',
    },
  },
});

// Radix Select (블로그 스타일: ShuffleControls 참고)
export const radixSelectTrigger = style({
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  // 블로그 스타일: rounded-md
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  // 블로그 스타일: bg-white / dark:bg-zinc-900
  background: vars.color.background,
  color: vars.color.text,
  fontSize: vars.font.sizeMd,
  fontWeight: 500,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 150ms ease, background 150ms ease',
  selectors: {
    '&:hover:not([data-disabled])': {
      background: vars.color.surface,
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.accent}`,
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const radixSelectContent = style({
  overflow: 'hidden',
  // 블로그 스타일: rounded-md
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  // 블로그 스타일: bg-white / dark:bg-zinc-900
  background: vars.color.background,
  boxShadow: vars.shadow.md,
  zIndex: 50,
});

export const radixSelectViewport = style({
  padding: vars.space[1],
});

export const radixSelectItem = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  // 블로그 스타일: rounded
  borderRadius: vars.radius.sm,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  fontSize: vars.font.sizeMd,
  color: vars.color.text,
  userSelect: 'none',
  cursor: 'pointer',
  outline: 'none',
  selectors: {
    '&[data-highlighted]': {
      // 블로그 스타일: data-[highlighted]:bg-zinc-100 / dark:bg-zinc-800
      background: vars.color.surface,
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const radixSelectItemIndicator = style({
  display: 'inline-flex',
  width: '16px',
  color: vars.color.text,
});

