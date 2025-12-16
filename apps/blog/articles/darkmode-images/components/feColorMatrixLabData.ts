export type Matrix4x5 = number[]; // length 20

export type PresetKey = "identity" | "invert" | "invert-hue-180" | "luma-invert";

export const IMAGE_OPTIONS = [
  {
    value: "sea-surface-temperature",
    label: "해수면 온도 지도",
    src: "/images/articles/darkmode-images/images/sea-surface-temperature.jpg",
    width: 1440,
    height: 720,
  },
  {
    value: "la-nina",
    label: "라니냐 다이어그램",
    src: "/images/articles/darkmode-images/images/la-nina.png",
    width: 696,
    height: 624,
  },
  {
    value: "em-spectrum",
    label: "전자기 스펙트럼",
    src: "/images/articles/darkmode-images/images/em-spectrum.png",
    width: 1440,
    height: 720,
  },
  {
    value: "naver-map",
    label: "네이버 지도",
    src: "/images/articles/darkmode-images/images/naver-map.png",
    width: 1440,
    height: 720,
  },
] as const;

export type ImageKey = (typeof IMAGE_OPTIONS)[number]["value"];

export const identityMatrix = (): Matrix4x5 => [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

export const PRESETS: Record<PresetKey, { label: string; description: string; values: Matrix4x5 }> = {
  identity: {
    label: "Identity",
    description: "변환 없음 (단위행렬)",
    values: identityMatrix(),
  },
  invert: {
    label: "Invert",
    description: "RGB -> (1-R, 1-G, 1-B)",
    values: [
      -1, 0, 0, 0, 1,
      0, -1, 0, 0, 1,
      0, 0, -1, 0, 1,
      0, 0, 0, 1, 0,
    ],
  },
  "invert-hue-180": {
    label: "Invert + HueRotate(180)",
    description: "invert(1) 뒤에 hue-rotate(180deg) 합성(스펙 계수 0.213/0.715/0.072 기반)",
    values: [
      0.574, -1.43, -0.144, 0, 1,
      -0.426, -0.43, -0.144, 0, 1,
      -0.426, -1.43, 0.856, 0, 1,
      0, 0, 0, 1, 0,
    ],
  },
  "luma-invert": {
    label: "Luma invert",
    description: "WCAG 상대 휘도 계수(0.2126/0.7152/0.0722) 기반",
    values: [
      0.5748, -1.4304, -0.1444, 0, 1,
      -0.4252, -0.4304, -0.1444, 0, 1,
      -0.4252, -1.4304, 0.8556, 0, 1,
      0, 0, 0, 1, 0,
    ],
  },
};

export const idx = (row: number, col: number) => row * 5 + col;

const clampFinite = (n: number) => (Number.isFinite(n) ? n : 0);

export const toValuesString = (m: Matrix4x5) => m.map((v) => String(v)).join(" ");

export const parseValuesString = (raw: string): Matrix4x5 => {
  const nums = raw
    .trim()
    .split(/[\s,]+/g)
    .filter(Boolean)
    .map((s) => clampFinite(Number(s)));

  const filled = new Array(20).fill(0).map((_, i) => nums[i] ?? 0);
  // alpha row 기본값은 (0,0,0,1,0)로 두는 게 더 안전하다
  filled[15] = nums[15] ?? 0;
  filled[16] = nums[16] ?? 0;
  filled[17] = nums[17] ?? 0;
  filled[18] = nums[18] ?? 1;
  filled[19] = nums[19] ?? 0;
  return filled as Matrix4x5;
};


