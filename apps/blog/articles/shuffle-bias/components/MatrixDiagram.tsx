'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';

interface MatrixDiagramProps {
  matrix: number[][];
  totalTrials: number;
  className?: string;
}

export function MatrixDiagram({ matrix, totalTrials, className }: MatrixDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const n = matrix.length;

  // D3 렌더링 로직
  useEffect(() => {
    if (!svgRef.current || n === 0 || totalTrials === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 500; // 내부 좌표계 기준 너비
    const height = 500; // 내부 좌표계 기준 높이
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    // 셀 크기 계산
    const cellSize = Math.min(
      (width - margin.left - margin.right) / n,
      (height - margin.top - margin.bottom) / n
    );

    // 스케일 정의
    const x = d3.scaleLinear().domain([0, n]).range([margin.left, margin.left + n * cellSize]);
    const y = d3.scaleLinear().domain([0, n]).range([margin.top, margin.top + n * cellSize]);

    // 색상 스케일
    // 기대값: totalTrials / n
    // 비율 r = observed / expected
    // r = 1 -> 중립 (흰색/회색)
    // r < 1 -> Negative Bias (Purple/Blue)
    // r > 1 -> Positive Bias (Orange/Red)
    const expected = totalTrials / n;
    
    // 색상 보간기: Purple to Orange
    // d3.interpolatePuOr(t)에서 t=0.5가 흰색(중립).
    // r=0 -> t=0 (Purple)
    // r=1 -> t=0.5 (White)
    // r=2 -> t=1 (Orange)
    // r 값을 [0, 2] 범위에서 [0, 1]로 매핑: t = r / 2
    // 하지만 시각적 대비를 위해 스케일을 조정할 수 있음.
    
    const colorScale = (value: number) => {
      const ratio = value / expected;
      // 편향을 더 잘 보여주기 위해 스케일 조정 (0 ~ 2 범위를 주로 사용)
      // 0 (never) -> 0 (Purple)
      // 1 (expected) -> 0.5 (White)
      // 2+ (twice as often) -> 1 (Orange)
      let t = ratio / 2;
      t = Math.max(0, Math.min(1, t));
      return d3.interpolatePuOr(t);
    };

    // 기존 내용 지우기 (또는 업데이트 패턴 사용 가능하지만 여기선 간단히)
    svg.selectAll('*').remove();

    // 그룹 생성
    const g = svg.append('g');

    // 데이터 바인딩을 위한 평탄화
    const data = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        data.push({ i, j, count: matrix[i][j] });
      }
    }

    // 셀 그리기
    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.j))
      .attr('y', d => y(d.i))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => colorScale(d.count))
      .attr('stroke', 'none'); // 성능을 위해 stroke 제거하거나 옅게

    // 외곽선
    g.append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', n * cellSize)
      .attr('height', n * cellSize)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // 축 레이블 (선택 사항)
    // i: original index (y축)
    // j: new index (x축)
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'currentColor')
      .text('New Position (j)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'currentColor')
      .text('Original Position (i)');

  }, [matrix, totalTrials, n]);

  return (
    <div className={cn('w-full aspect-square max-w-[500px] mx-auto', className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full block"
        style={{ shapeRendering: 'crispEdges' }} // 픽셀 아트처럼 선명하게
      />
    </div>
  );
}

