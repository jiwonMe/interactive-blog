import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const simulationRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
});

// 블로그 스타일: md:grid-cols-[min(46vh,460px)_minmax(0,1fr)]
export const simulationGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space[6],
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'minmax(0, 460px) minmax(0, 1fr)',
      alignItems: 'start',
    },
  },
});

// 블로그 스타일: p-3 rounded-md border bg-zinc-100
export const simulationCard = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceAlt,
  padding: vars.space[3],
});

export const statsList = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space[1],
});

export const statRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: vars.space[2],
});

// 블로그 스타일: text-[11px] 또는 text-sm
export const statLabel = style({
  fontSize: '11px',
  lineHeight: '20px',
  color: vars.color.textMuted,
});

export const statValue = style({
  fontSize: '11px',
  lineHeight: '20px',
  color: vars.color.textMuted,
  fontFamily: vars.font.mono,
});

