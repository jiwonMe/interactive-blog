import * as React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';

export type AxisOrientation = 'bottom' | 'left';

export interface AxisProps {
  orientation: AxisOrientation;
  scale: any;
  innerWidth: number;
  innerHeight: number;
  label?: string;
  tickCount?: number;
}

export function Axis({ orientation, scale, innerWidth, innerHeight, label, tickCount }: AxisProps) {
  if (orientation === 'bottom') {
    return (
      <AxisBottom
        top={innerHeight}
        scale={scale}
        numTicks={tickCount}
        label={label}
        tickLabelProps={{ fill: 'currentColor', fontSize: 11 }}
        labelProps={{ fill: 'currentColor', fontSize: 11, textAnchor: 'end', x: innerWidth, y: 32 }}
      />
    );
  }

  return (
    <AxisLeft
      scale={scale}
      numTicks={tickCount}
      label={label}
      tickLabelProps={{ fill: 'currentColor', fontSize: 11 }}
      labelProps={{ fill: 'currentColor', fontSize: 11, textAnchor: 'start', x: 0, y: -10 }}
    />
  );
}






