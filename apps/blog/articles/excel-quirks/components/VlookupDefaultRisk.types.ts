"use client";

export interface DataItem {
  id: number;
  name: string;
}

export interface TraceStep {
  idx: number;
  label: string;
  msg: string;
  rangeStart: number;
  rangeEnd: number;
}

export interface TraceInfo {
  steps: TraceStep[];
  resultIdx: number;
  resultName: string;
  isCorrect: boolean;
  correctName: string;
}

