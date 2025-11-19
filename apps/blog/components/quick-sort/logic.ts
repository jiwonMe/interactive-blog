import { Step, PartitionStep } from './types';

export const generateSteps = (arr: number[]): Step[] => {
  const newSteps: Step[] = [];
  const tempArray = [...arr];
  
  const partition = (low: number, high: number) => {
    const pivot = tempArray[high];
    let i = low - 1;
    
    newSteps.push({
      array: [...tempArray],
      pivotIndex: high,
      compareIndices: [],
      swapIndices: [],
      sortedIndices: [],
      description: `피벗으로 ${pivot}을 선택합니다.`,
    });

    for (let j = low; j < high; j++) {
      newSteps.push({
        array: [...tempArray],
        pivotIndex: high,
        compareIndices: [j],
        swapIndices: [],
        sortedIndices: [],
        description: `${tempArray[j]}와 피벗 ${pivot}을 비교합니다.`,
      });

      if (tempArray[j] < pivot) {
        i++;
        // Swap
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
        newSteps.push({
          array: [...tempArray],
          pivotIndex: high,
          compareIndices: [j],
          swapIndices: [i, j],
          sortedIndices: [],
          description: `${tempArray[i]}가 피벗보다 작으므로 교환합니다.`,
        });
      }
    }
    
    [tempArray[i + 1], tempArray[high]] = [tempArray[high], tempArray[i + 1]];
    newSteps.push({
      array: [...tempArray],
      pivotIndex: i + 1,
      compareIndices: [],
      swapIndices: [i + 1, high],
      sortedIndices: [i + 1],
      description: `피벗 ${pivot}을 정렬된 위치로 이동합니다.`,
    });
    
    return i + 1;
  };

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      
      // Add sorted indices for visualization context
      // Note: In a full visualization, we might want to track cumulative sorted indices
      // but for simplicity we're keeping the structure from the original code.

      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  quickSort(0, tempArray.length - 1);
  
  // Final step - all sorted
  newSteps.push({
    array: [...tempArray],
    pivotIndex: null,
    compareIndices: [],
    swapIndices: [],
    sortedIndices: tempArray.map((_, i) => i),
    description: '정렬이 완료되었습니다.',
  });

  return newSteps;
};

export const generatePartitionSteps = (arr: number[], pivotIndex: number): PartitionStep[] => {
  const steps: PartitionStep[] = [];
  const tempArray = [...arr];
  const pivot = tempArray[pivotIndex];
  
  steps.push({
    array: [...tempArray],
    compareIndex: null,
    swapIndices: [],
    description: `초기 상태: 피벗은 ${pivot}입니다.`,
  });

  let i = -1;
  
  for (let j = 0; j < tempArray.length; j++) {
    if (j === pivotIndex) continue; // 피벗은 건너뛰기
    
    steps.push({
      array: [...tempArray],
      compareIndex: j,
      swapIndices: [],
      description: `${tempArray[j]}와 피벗 ${pivot}을 비교합니다.`,
    });

    if (tempArray[j] < pivot) {
      i++;
      if (i === pivotIndex) i++; // 피벗 위치는 건너뛰기
      
      if (i !== j) {
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
        steps.push({
          array: [...tempArray],
          compareIndex: j,
          swapIndices: [i, j],
          description: `${tempArray[i]}가 피벗보다 작으므로 작은 영역으로 이동합니다.`,
        });
      }
    }
  }
  
  // 피벗을 최종 위치로 이동
  const finalPos = i + 1;
  if (finalPos !== pivotIndex) {
    [tempArray[finalPos], tempArray[pivotIndex]] = [tempArray[pivotIndex], tempArray[finalPos]];
    steps.push({
      array: [...tempArray],
      compareIndex: null,
      swapIndices: [finalPos, pivotIndex],
      description: `피벗 ${pivot}을 최종 위치로 이동합니다. 분할 완료!`,
    });
  } else {
    steps.push({
      array: [...tempArray],
      compareIndex: null,
      swapIndices: [],
      description: `피벗 ${pivot}이 이미 올바른 위치에 있습니다. 분할 완료!`,
    });
  }

  return steps;
};
