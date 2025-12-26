"use client";

export type ValueType = "TRUE" | "FALSE" | '"1"' | '"12"' | "1" | "12" | "99" | "0";

export interface RowData {
  id: number;
  valA: ValueType;
  valB: ValueType;
}

