'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import type { Candidate } from '../lib/secretary-types';

interface SecretaryCandidateChartProps {
  candidates: Candidate[];
  selectedIndex: number | null;
  observeCount: number;
  maxObserved: number;
}

/**
 * 비서문제 후보자 막대 차트
 * d3.js 기반 구현
 */
export function SecretaryCandidateChart({
  candidates,
  selectedIndex,
  observeCount,
  maxObserved,
}: SecretaryCandidateChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 상위 percentile 값 계산
  const percentileValues = useMemo(() => {
    if (candidates.length === 0) return { top1: 100, top5: 100, top10: 100 };
    
    const sortedValues = [...candidates].map(c => c.value).sort((a, b) => b - a);
    const getPercentileValue = (percent: number) => {
      const index = Math.floor(sortedValues.length * (percent / 100));
      return sortedValues[Math.min(index, sortedValues.length - 1)];
    };

    return {
      top1: getPercentileValue(1),
      top5: getPercentileValue(5),
      top10: getPercentileValue(10),
    };
  }, [candidates]);

  // 막대 색상 결정
  const getBarColor = (candidate: Candidate): string => {
    if (candidate.index === selectedIndex) {
      return '#84cc16'; // lime-500 (선택된 후보)
    }
    if (candidate.index < observeCount) {
      if (candidate.value === maxObserved) {
        return '#1e40af'; // blue-800 (관찰 단계 최댓값)
      }
      return '#60a5fa'; // blue-400 (관찰 단계)
    }
    return '#d4d4d8'; // zinc-300 (선택 단계)
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || candidates.length === 0) return;

    const containerWidth = containerRef.current.clientWidth;
    const width = Math.max(300, containerWidth);
    const height = 300;
    const margin = { top: 20, right: 16, bottom: 40, left: 44 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일 설정
    const xScale = d3.scaleBand()
      .domain(candidates.map(c => c.index.toString()))
      .range([0, innerWidth])
      .padding(0.15);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Y축 그리드
    [0, 25, 50, 75, 100].forEach((tick) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(tick))
        .attr('y2', yScale(tick))
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1);
    });

    // 상위 percentile 기준선들
    const referenceLines = [
      { value: percentileValues.top1, label: 'Top 1%', color: '#dc2626', dash: '3,3' },
      { value: percentileValues.top5, label: 'Top 5%', color: '#ea580c', dash: '4,4' },
      { value: percentileValues.top10, label: 'Top 10%', color: '#f59e0b', dash: '5,5' },
    ];

    referenceLines.forEach(({ value, label, color, dash }) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(value))
        .attr('y2', yScale(value))
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', dash)
        .attr('opacity', 0.6);

      g.append('text')
        .attr('x', innerWidth - 5)
        .attr('y', yScale(value) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', color)
        .attr('font-size', 11)
        .attr('font-weight', 600)
        .text(label);
    });

    // 관찰 단계 최댓값 기준선
    if (observeCount > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(maxObserved))
        .attr('y2', yScale(maxObserved))
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }

    // 막대 그래프
    g.selectAll('.bar')
      .data(candidates)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.index.toString()) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('rx', 4)
      .attr('fill', d => getBarColor(d))
      .attr('opacity', 0.9);

    // 관찰/선택 경계선
    if (observeCount > 0) {
      const boundaryX = (xScale(observeCount.toString()) || 0) - xScale.bandwidth() * 0.075;
      g.append('line')
        .attr('x1', boundaryX)
        .attr('x2', boundaryX)
        .attr('y1', -10)
        .attr('y2', innerHeight)
        .attr('stroke', '#334155')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4');
    }

    // X축 레이블
    g.selectAll('.x-label')
      .data(candidates)
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .attr('x', d => (xScale(d.index.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', 11)
      .attr('opacity', 0.6)
      .text(d => d.index + 1);

    // Y축 레이블
    [0, 25, 50, 75, 100].forEach((tick) => {
      g.append('text')
        .attr('x', -8)
        .attr('y', yScale(tick))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', 11)
        .attr('opacity', 0.6)
        .text(tick);
    });

  }, [candidates, selectedIndex, observeCount, maxObserved, percentileValues]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  );
}
