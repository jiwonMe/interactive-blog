export type Oklch = {
  L: number; // 0..1
  C: number; // 0..~
  h: number; // degrees
};

type LinearRgb = { r: number; g: number; b: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const srgbToLinear = (c: number) => {
  const x = clamp01(c);
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

const linearToSrgb = (c: number) => {
  const x = clamp01(c);
  return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
};

// OKLab reference (Björn Ottosson)
const linearSrgbToOklab = (rgb: LinearRgb) => {
  const l = 0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b;
  const m = 0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b;
  const s = 0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
};

const oklabToLinearSrgb = (lab: { L: number; a: number; b: number }): LinearRgb => {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
};

const toDegrees = (rad: number) => (rad * 180) / Math.PI;
const toRadians = (deg: number) => (deg * Math.PI) / 180;

export const srgb8ToOklch = (r8: number, g8: number, b8: number): Oklch => {
  const r = srgbToLinear(r8 / 255);
  const g = srgbToLinear(g8 / 255);
  const b = srgbToLinear(b8 / 255);

  const lab = linearSrgbToOklab({ r, g, b });
  const C = Math.hypot(lab.a, lab.b);
  const h = (toDegrees(Math.atan2(lab.b, lab.a)) + 360) % 360;
  return { L: clamp01(lab.L), C, h };
};

export const oklchToSrgb01 = (oklch: Oklch): { r: number; g: number; b: number } => {
  const a = oklch.C * Math.cos(toRadians(oklch.h));
  const b = oklch.C * Math.sin(toRadians(oklch.h));
  const linear = oklabToLinearSrgb({ L: oklch.L, a, b });
  return {
    r: linearToSrgb(linear.r),
    g: linearToSrgb(linear.g),
    b: linearToSrgb(linear.b),
  };
};

const isInGamut01 = (rgb: { r: number; g: number; b: number }) =>
  rgb.r >= 0 && rgb.r <= 1 && rgb.g >= 0 && rgb.g <= 1 && rgb.b >= 0 && rgb.b <= 1;

export const invertLightnessOklch = (oklch: Oklch): Oklch => ({
  L: 1 - clamp01(oklch.L),
  C: oklch.C,
  h: oklch.h,
});

export const gamutMapByReducingChroma = (oklch: Oklch, steps: number) => {
  const s = Math.max(1, Math.min(12, Math.floor(steps)));

  const tryRgb = (C: number) => oklchToSrgb01({ ...oklch, C });

  if (isInGamut01(tryRgb(oklch.C))) {
    return { oklch, rgb01: tryRgb(oklch.C) };
  }

  let lo = 0;
  let hi = oklch.C;
  let best = 0;

  for (let i = 0; i < s; i += 1) {
    const mid = (lo + hi) / 2;
    const rgb = tryRgb(mid);
    if (isInGamut01(rgb)) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const mapped = { ...oklch, C: best };
  return { oklch: mapped, rgb01: tryRgb(best) };
};

export const invertSrgb8ViaOklch = (
  r8: number,
  g8: number,
  b8: number,
  opts: { bisectionSteps: number }
) => {
  const oklch = srgb8ToOklch(r8, g8, b8);
  const inverted = invertLightnessOklch(oklch);
  const { rgb01 } = gamutMapByReducingChroma(inverted, opts.bisectionSteps);
  return {
    r8: Math.round(clamp01(rgb01.r) * 255),
    g8: Math.round(clamp01(rgb01.g) * 255),
    b8: Math.round(clamp01(rgb01.b) * 255),
  };
};


