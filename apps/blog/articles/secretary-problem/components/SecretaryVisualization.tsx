'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Candidate } from '../lib/secretary-types';

interface SecretaryVisualizationProps {
  candidates: Candidate[];
  selectedIndex: number | null;
  threshold: number;
  numCandidates: number;
  onThresholdChange: (threshold: number) => void;
}

/**
 * 비서문제 D3 시각화 컴포넌트
 */
export function SecretaryVisualization({
  candidates,
  selectedIndex,
  threshold,
  numCandidates,
  onThresholdChange,
}: SecretaryVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || candidates.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 레이아웃 설정
    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    const width = 900;
    const height = 500;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일 설정
    const xScale = d3.scaleBand()
      .domain(candidates.map(c => c.index.toString()))
      .range([0, chartWidth])
      .padding(0.15);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    const observeCount = Math.floor(numCandidates * threshold);
    const observePhase = candidates.slice(0, observeCount);
    const maxObserved = observePhase.length > 0 
      ? Math.max(...observePhase.map(c => c.value)) 
      : 0;

    // 상위 percentile 값 계산
    const sortedValues = [...candidates].map(c => c.value).sort((a, b) => b - a);
    const getPercentileValue = (percent: number) => {
      const index = Math.floor(sortedValues.length * (percent / 100));
      return sortedValues[Math.min(index, sortedValues.length - 1)];
    };

    const top1Percent = getPercentileValue(1);
    const top5Percent = getPercentileValue(5);
    const top10Percent = getPercentileValue(10);

    // 상위 percentile 기준선들
    const percentileLines = [
      { value: top1Percent, label: 'Top 1%', color: '#dc2626', dash: '3,3' },
      { value: top5Percent, label: 'Top 5%', color: '#ea580c', dash: '4,4' },
      { value: top10Percent, label: 'Top 10%', color: '#f59e0b', dash: '5,5' },
    ];

    percentileLines.forEach(({ value, label, color, dash }) => {
      // 기준선
      g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yScale(value))
        .attr('y2', yScale(value))
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', dash)
        .attr('opacity', 0.6);

      // 레이블
      g.append('text')
        .attr('x', chartWidth - 5)
        .attr('y', yScale(value) - 5)
        .attr('text-anchor', 'end')
        .attr('class', 'text-xs font-semibold')
        .attr('fill', color)
        .text(label);
    });

    // 관찰 단계 최댓값 기준선
    if (observeCount > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
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
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('rx', 4)
      .attr('fill', d => {
        if (d.index === selectedIndex) return '#84cc16'; // 선택된 후보 (녹색)
        if (d.index < observeCount) {
          // 관찰 단계 (파란색 계열)
          if (d.value === maxObserved) return '#1e40af'; // 최댓값 (진한 파란색)
          return '#60a5fa'; // 일반 (밝은 파란색)
        }
        return '#d4d4d8'; // 선택 단계 (회색)
      })
      .attr('opacity', 0.9);

    // X축 레이블
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .selectAll('.x-label')
      .data(candidates)
      .enter()
      .append('text')
      .attr('x', d => (xScale(d.index.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-zinc-600 dark:fill-zinc-400')
      .style('font-size', '12px')
      .text(d => `${d.index + 1}번`);

    // 경계선 (수직 점선)
    const boundaryX = observeCount > 0 
      ? (xScale(observeCount.toString()) || 0) - xScale.bandwidth() * 0.075
      : 0;
    
    g.append('line')
      .attr('x1', boundaryX)
      .attr('x2', boundaryX)
      .attr('y1', -20)
      .attr('y2', chartHeight)
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8,4');

    // 드래그 가능한 슬라이더
    const sliderY = chartHeight + 50;
    const sliderWidth = chartWidth;

    // 슬라이더 트랙 (클릭 가능한 배경)
    g.append('rect')
      .attr('x', 0)
      .attr('y', sliderY - 12)
      .attr('width', sliderWidth)
      .attr('height', 24)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('click', function(event) {
        const [mouseX] = d3.pointer(event, g.node());
        const newX = Math.max(0, Math.min(sliderWidth, mouseX));
        const newThreshold = Math.max(0.1, Math.min(0.9, newX / sliderWidth));
        onThresholdChange(newThreshold);
      });

    // 슬라이더 트랙 (시각적 요소)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', sliderWidth)
      .attr('y1', sliderY)
      .attr('y2', sliderY)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .style('pointer-events', 'none');

    // 슬라이더 핸들
    const handleGroup = g.append('g')
      .attr('class', 'slider-handle')
      .attr('transform', `translate(${threshold * sliderWidth},${sliderY})`);

    handleGroup.append('circle')
      .attr('r', 12)
      .attr('fill', '#334155')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'grab');

    // 드래그 동작
    const drag = d3.drag<SVGGElement, unknown>()
      .container(g.node() as any)
      .subject(function() {
        const currentX = threshold * sliderWidth;
        return { x: currentX, y: sliderY };
      })
      .on('start', function() {
        d3.select(this).style('cursor', 'grabbing');
      })
      .on('drag', function(event) {
        const newX = Math.max(0, Math.min(sliderWidth, event.x));
        const newThreshold = Math.max(0.1, Math.min(0.9, newX / sliderWidth));
        onThresholdChange(newThreshold);
        d3.select(this).attr('transform', `translate(${newX},${sliderY})`);
      })
      .on('end', function() {
        d3.select(this).style('cursor', 'grab');
      });

    handleGroup.call(drag as any);

  }, [candidates, threshold, selectedIndex, numCandidates, onThresholdChange]);

  return <svg ref={svgRef} className="max-w-full h-auto" />;
}

