'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';

type NodeId = 'a' | 'b' | 'c';

type Edge = {
  from: NodeId;
  to: NodeId;
  id: string;
};

type DiagramSpec = {
  title: string;
  edges: Edge[];
};

const NODE_POS: Record<NodeId, { x: number; y: number; label: string }> = {
  a: { x: 80, y: 70, label: 'a' },
  b: { x: 220, y: 70, label: 'b' },
  c: { x: 150, y: 170, label: 'c' },
};

const NODE_R = 18;

function edgePathClipped(from: NodeId, to: NodeId, bend: number) {
  const p1 = NODE_POS[from];
  const p2 = NODE_POS[to];
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = -dy / len;
  const uy = dx / len;

  const cx = mx + ux * bend;
  const cy = my + uy * bend;

  // Quadratic Bézier: P0(start)=p1, P1(control)=(c), P2(end)=p2
  // Clip endpoints to node circles so arrows touch the perimeter (not the center).
  // Tangent direction at t=0: P1 - P0, at t=1: P2 - P1.
  const sdx = cx - p1.x;
  const sdy = cy - p1.y;
  const sl = Math.max(1, Math.hypot(sdx, sdy));
  const sx = p1.x + (sdx / sl) * NODE_R;
  const sy = p1.y + (sdy / sl) * NODE_R;

  const edx = p2.x - cx;
  const edy = p2.y - cy;
  const el = Math.max(1, Math.hypot(edx, edy));
  const ex = p2.x - (edx / el) * NODE_R;
  const ey = p2.y - (edy / el) * NODE_R;

  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

export function TransitivityDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);

  const specs = useMemo<DiagramSpec[]>(
    () => [
      {
        title: '추이적(정상)',
        edges: [
          { id: 'ab', from: 'a', to: 'b' },
          { id: 'bc', from: 'b', to: 'c' },
          { id: 'ac', from: 'a', to: 'c' },
        ],
      },
      {
        title: '비추이적(사이클)',
        edges: [
          { id: 'ab', from: 'a', to: 'b' },
          { id: 'bc', from: 'b', to: 'c' },
          { id: 'ca', from: 'c', to: 'a' },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 720;
    const height = 240;
    const panelW = width / 2;
    const panelH = height;

    svg.selectAll('*').remove();

    // defs: arrow marker
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow-diagram')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'currentColor');

    const bends: Record<string, number> = {
      ab: -14,
      bc: 14,
      ac: -14,
      ca: 14,
    };

    const drawPanel = (panel: d3.Selection<SVGGElement, unknown, null, undefined>, spec: DiagramSpec) => {
      // title
      panel
        .append('text')
        .attr('x', panelW / 2)
        .attr('y', 26)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.9)
        .text(spec.title);

      // edges
      panel
        .selectAll('path.edge')
        .data(spec.edges)
        .join('path')
        .attr('class', 'edge')
        .attr('d', (d) => edgePathClipped(d.from, d.to, bends[d.id] ?? 0))
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.85)
        .attr('marker-end', 'url(#arrow-diagram)');

      // nodes
      const nodeEntries = Object.entries(NODE_POS) as Array<[NodeId, { x: number; y: number; label: string }]>;

      const nodeG = panel
        .selectAll('g.node')
        .data(nodeEntries)
        .join('g')
        .attr('class', 'node')
        .attr('transform', ([, n]) => `translate(${n.x},${n.y})`);

      nodeG
        .append('circle')
        .attr('r', NODE_R)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2)
        .attr('opacity', 0.9);

      nodeG
        .append('text')
        .text(([, n]) => n.label)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 16)
        .attr('font-weight', 700)
        // Use KaTeX math font so a,b,c look like LaTeX math italic.
        .attr('font-family', 'KaTeX_Math, KaTeX_Main, ui-serif, serif')
        .attr('font-style', 'italic')
        .attr('fill', 'currentColor');
    };

    // panels
    const left = svg.append('g').attr('transform', `translate(0,0)`);
    const right = svg.append('g').attr('transform', `translate(${panelW},0)`);

    // subtle divider (no border; just spacing/opacity)
    svg
      .append('line')
      .attr('x1', panelW)
      .attr('x2', panelW)
      .attr('y1', 18)
      .attr('y2', panelH - 18)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.12);

    drawPanel(left, specs[0]);
    drawPanel(right, specs[1]);
  }, [specs]);

  return (
    <div
      className={cn(
        /* Layout */
        'w-full',
      )}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 720 240"
        className={cn(
          /* Layout */
          'w-full h-auto block',
          /* Color */
          'text-zinc-900 dark:text-zinc-100',
        )}
      />
    </div>
  );
}


