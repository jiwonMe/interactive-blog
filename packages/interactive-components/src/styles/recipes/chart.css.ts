import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const chartRoot = style({
  width: '100%',
});

export const chartSvg = style({
  width: '100%',
  display: 'block',
  overflow: 'visible',
  color: vars.color.textMuted,
});

export const chartFooter = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space[2],
  marginTop: vars.space[3],
});

// 블로그 스타일: text-sm italic text-zinc-500
export const chartCaption = style({
  fontSize: vars.font.sizeSm,
  fontStyle: 'italic',
  color: vars.color.textMuted,
});

// 블로그 스타일: 툴팁은 shadow-md, rounded-md
export const tooltipBox = style({
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  padding: vars.space[3],
  color: vars.color.text,
  fontSize: vars.font.sizeSm,
  lineHeight: 1.5,
});

export const legendRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
  alignItems: 'center',
});

export const legendItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
});

export const legendSwatch = style({
  width: '10px',
  height: '10px',
  borderRadius: '2px',
});

export const legendLabel = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.textMuted,
});

