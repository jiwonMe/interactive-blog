/**
 * 셔플 알고리즘 정의 및 시뮬레이션 로직
 */

export type ShuffleFunction = (array: number[]) => number[];

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  shuffle: ShuffleFunction;
}

// 1. Fisher-Yates Shuffle (Unbiased)
// O(n) 시간 복잡도, 편향 없음.
export const fisherYates: Algorithm = {
  id: 'fisher-yates',
  name: 'Fisher-Yates Shuffle',
  description: 'Knuth Shuffle이라고도 불리며, 편향이 없는 완벽한 셔플 알고리즘입니다.',
  shuffle: (array: number[]) => {
    const copy = [...array];
    let m = copy.length;
    let t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = copy[m];
      copy[m] = copy[i];
      copy[i] = t;
    }
    return copy;
  },
};

// 2. Random Comparator (Biased)
// Array.prototype.sort(() => Math.random() - 0.5)
// 매우 흔한 실수로, 심각한 편향을 가짐.
export const randomComparator: Algorithm = {
  id: 'random-comparator',
  name: 'Random Comparator',
  description: '`sort(() => Math.random() - 0.5)`를 사용하는 방식입니다. 이는 공정하지 않으며 실행 시간도 예측하기 어렵습니다.',
  shuffle: (array: number[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  },
};

// 3. Naive Swap (Biased)
// 각 위치 i에 대해 임의의 위치 j (0 <= j < n)와 교환.
// n^n 가지 경우의 수를 생성하므로 n!로 나누어 떨어지지 않아 편향 발생.
export const naiveSwap: Algorithm = {
  id: 'naive-swap',
  name: 'Naive Swap',
  description: '모든 인덱스 i에 대해 임의의 인덱스 j와 교환합니다. Fisher-Yates와 비슷해 보이지만 편향이 발생합니다.',
  shuffle: (array: number[]) => {
    const copy = [...array];
    const n = copy.length;
    for (let i = 0; i < n; i++) {
      const j = Math.floor(Math.random() * n);
      const t = copy[i];
      copy[i] = copy[j];
      copy[j] = t;
    }
    return copy;
  },
};

export const ALGORITHMS = [fisherYates, randomComparator, naiveSwap];

