import * as React from 'react';
import { GridColumns, GridRows } from '@visx/grid';

export interface GridProps {
  xScale: any;
  yScale: any;
  innerWidth: number;
  innerHeight: number;
  stroke?: string;
}

export function Grid({ xScale, yScale, innerWidth, innerHeight, stroke = 'currentColor' }: GridProps) {
  return (
    <g opacity={0.18}>
      <GridRows scale={yScale} width={innerWidth} stroke={stroke} />
      <GridColumns scale={xScale} height={innerHeight} stroke={stroke} />
    </g>
  );
}






