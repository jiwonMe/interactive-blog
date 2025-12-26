import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

const space = vars.space;

const fontSize = {
  sm: vars.font.sizeSm,
  md: vars.font.sizeMd,
  lg: vars.font.sizeLg,
};

const fontFamily = {
  mono: vars.font.mono,
};

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    sm: { '@media': 'screen and (min-width: 640px)' },
    md: { '@media': 'screen and (min-width: 768px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'inline', 'inline-block', 'flex', 'grid'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    gap: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: space,
    marginBottom: space,
    marginLeft: space,
    marginRight: space,
    width: ['auto', '100%'],
  },
  shorthands: {
    p: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

const baseProperties = defineProperties({
  properties: {
    color: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color,
    borderRadius: vars.radius,
    fontSize,
    fontFamily,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, baseProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];






