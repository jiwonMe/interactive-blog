import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// 블로그 스타일: rounded-xl p-4 border bg-zinc-50 border-zinc-200
export const panel = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: 'none',
  overflow: 'hidden',
});

export const panelInner = style({
  padding: vars.space[4],
});

export const panelHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[3],
  marginBottom: vars.space[4],
});

// 블로그 스타일: text-sm font-semibold
export const panelTitle = style({
  fontSize: vars.font.sizeLg,
  fontWeight: 600,
  color: vars.color.text,
  lineHeight: 1.4,
});

// 블로그 스타일: text-sm leading-relaxed
export const panelDescription = style({
  marginTop: vars.space[2],
  fontSize: vars.font.sizeMd,
  color: vars.color.textMuted,
  lineHeight: 1.6,
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

// 블로그 스타일: flex flex-wrap gap-3
export const controlBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[3],
});

export const controlGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[3],
});

// 블로그 스타일: md:grid-cols-[min(46vh,460px)_minmax(0,1fr)]
export const splitView = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: vars.space[6],
  },
  variants: {
    variant: {
      stack: {},
      twoColumn: {
        '@media': {
          'screen and (min-width: 768px)': {
            gridTemplateColumns: 'minmax(0, 460px) minmax(0, 1fr)',
            alignItems: 'start',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'twoColumn',
  },
});

