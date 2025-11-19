export type Step = {
  array: number[];
  pivotIndex: number | null;
  compareIndices: number[];
  swapIndices: number[];
  sortedIndices: number[];
  description: string;
};

export type PartitionStep = {
  array: number[];
  compareIndex: number | null;
  swapIndices: number[];
  description: string;
};

