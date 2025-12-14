import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 10px',
    borderRadius: vars.radius.full,
    border: `1px solid ${vars.color.border}`,
    fontSize: vars.font.sizeSm,
    fontWeight: 600,
  },
  variants: {
    variant: {
      neutral: {
        color: vars.color.textMuted,
        background: 'transparent',
      },
      primary: {
        color: vars.color.accent,
        borderColor: vars.color.accent,
        background: `color-mix(in srgb, ${vars.color.accent} 12%, transparent)`,
      },
      success: {
        color: vars.color.success,
        borderColor: vars.color.success,
        background: `color-mix(in srgb, ${vars.color.success} 12%, transparent)`,
      },
      warning: {
        color: vars.color.warning,
        borderColor: vars.color.warning,
        background: `color-mix(in srgb, ${vars.color.warning} 12%, transparent)`,
      },
      danger: {
        color: vars.color.danger,
        borderColor: vars.color.danger,
        background: `color-mix(in srgb, ${vars.color.danger} 12%, transparent)`,
      },
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const progressTrack = style({
  width: '100%',
  height: '8px',
  borderRadius: vars.radius.full,
  background: vars.color.border,
  overflow: 'hidden',
});

export const progressFill = style({
  height: '100%',
  borderRadius: vars.radius.full,
  background: vars.color.buttonPrimaryBg,
  transition: 'width 150ms ease',
});

