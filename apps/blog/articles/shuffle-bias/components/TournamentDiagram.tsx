'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';
import type { Edge, NodeId } from './tournamentSamplerUtils';

type TournamentDiagramProps = {
  edges: Edge[];
  title: string;
};

type NodePos = { x: number; y: number; label: string };

const NODE_R = 20;

const NODES: Record<NodeId, NodePos> = {
  a: { x: 140, y: 80, label: 'a' },
  b: { x: 380, y: 80, label: 'b' },
  c: { x: 260, y: 200, label: 'c' },
};

function edgePathClipped(from: NodeId, to: NodeId, bend: number) {
  const p1 = NODES[from];
  const p2 = NODES[to];
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  // perpendicular unit vector
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = -dy / len;
  const uy = dx / len;

  const cx = mx + ux * bend;
  const cy = my + uy * bend;

  // Quadratic Bézier: P0=p1, P1=(c), P2=p2
  // Clip endpoints so the arrow touches the perimeter, not the center.
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

export function TournamentDiagram({ edges, title }: TournamentDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const bends = useMemo<Record<Edge['id'], number>>(
    () => ({
      ab: -22,
      bc: 22,
      ac: -22,
    }),
    [],
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 520;
    const height = 260;

    svg.selectAll('*').remove();

    // defs (arrow marker)
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow-tournament')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'currentColor');

    const g = svg.append('g');

    // edges
    g
      .selectAll('path.edge')
      .data(edges)
      .join('path')
      .attr('class', 'edge')
      .attr('d', (d) => edgePathClipped(d.from, d.to, bends[d.id]))
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2.5)
      .attr('marker-end', 'url(#arrow-tournament)')
      .attr('opacity', 0.9);

    // nodes
    const nodeG = g
      .selectAll('g.node')
      .data(Object.entries(NODES) as Array<[NodeId, NodePos]>)
      .join('g')
      .attr('class', 'node')
      .attr('transform', ([, n]) => `translate(${n.x},${n.y})`);

    nodeG
      .append('circle')
      .attr('r', NODE_R)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.10);

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
      .attr('font-family', 'KaTeX_Math, KaTeX_Main, ui-serif, serif')
      .attr('font-style', 'italic')
      .attr('fill', 'currentColor');

    // title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.8)
      .text(title);
  }, [bends, edges, title]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 520 260"
      className={cn(
        /* Layout */
        'w-full h-auto block',
        /* Color */
        'text-zinc-900 dark:text-zinc-100',
      )}
    />
  );
}


