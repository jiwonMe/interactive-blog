import Image, { type ImageProps } from 'next/image';
import React, { useId, type CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type ColorAdjustments = {
  /**
   * Hue rotation in degrees.
   * -180 ~ 180 정도 범위를 추천합니다.
   */
  hueRotate?: number;
  /**
   * Saturation multiplier. 1 = original, 0 = grayscale.
   * 0 ~ 3 정도 범위를 추천합니다.
   */
  saturate?: number;
  /**
   * Grayscale amount (0~1). 1이면 완전 흑백에 가깝게 됩니다.
   * 내부적으로 feColorMatrix(saturate)로 근사합니다.
   */
  grayscale?: number;
  /**
   * Sepia amount (0~1). 1이면 완전 세피아에 가깝게 됩니다.
   */
  sepia?: number;
  /**
   * Brightness multiplier. 1 = original.
   * 0 ~ 2 정도 범위를 추천합니다.
   */
  brightness?: number;
  /**
   * Contrast multiplier. 1 = original.
   * 0 ~ 2 정도 범위를 추천합니다.
   */
  contrast?: number;
  /**
   * Invert amount (0~1). 1이면 완전 반전입니다.
   * 부분 반전도 가능합니다.
   */
  invert?: number;
};

type CommonProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  wrapperClassName?: string;
  rewriteSrc?: (src: string | undefined) => string | undefined;
  /**
   * SVG filter 체인에 색상 조정을 추가합니다.
   * children/preset로 만든 필터 뒤에 이어서 적용됩니다.
   */
  color?: ColorAdjustments;
  /**
   * color prop이 있어도 색상 조정을 끄고 싶을 때 사용합니다.
   */
  enableColor?: boolean;
  /**
   * preset을 쓰면 children 없이도 기본 SVG filter가 적용됩니다.
   * children을 주면 preset보다 children이 우선합니다.
   */
  preset?: 'none' | 'blur' | 'noise' | 'duotone' | 'invert-hue-180';
  /**
   * <filter> 내부에 들어갈 SVG filter primitives를 children으로 전달하세요.
   * 예) <feGaussianBlur stdDeviation="2" />
   */
  children?: React.ReactNode;
};

type FillImageProps = CommonProps & {
  fill: true;
  sizes: string;
  width?: never;
  height?: never;
};

type FixedImageProps = CommonProps & {
  fill?: false;
  width: number;
  height: number;
  sizes?: string;
};

export type SVGFilteredImageProps = (FillImageProps | FixedImageProps) & {
  priority?: boolean;
  quality?: ImageProps['quality'];
};

const renderPresetFilterPrimitives = (preset: NonNullable<CommonProps['preset']>) => {
  if (preset === 'none') return null;

  if (preset === 'blur') {
    return <feGaussianBlur stdDeviation="2" />;
  }

  if (preset === 'invert-hue-180') {
    return (
      <>
        <feColorMatrix type="hueRotate" values="180" />
        <feComponentTransfer>
          {/* invert: x -> 1 - x */}
          <feFuncR type="linear" slope={-1} intercept={1} />
          <feFuncG type="linear" slope={-1} intercept={1} />
          <feFuncB type="linear" slope={-1} intercept={1} />
        </feComponentTransfer>
      </>
    );
  }

  if (preset === 'noise') {
    return (
      <>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" />
        <feDisplacementMap in="SourceGraphic" scale="8" />
      </>
    );
  }

  // duotone (rough, but useful): grayscale -> tint
  return (
    <>
      <feColorMatrix
        type="matrix"
        values="
          0.2126 0.7152 0.0722 0 0
          0.2126 0.7152 0.0722 0 0
          0.2126 0.7152 0.0722 0 0
          0      0      0      1 0
        "
      />
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="1.0" exponent="0.9" offset="0.05" />
        <feFuncG type="gamma" amplitude="1.0" exponent="0.9" offset="0.02" />
        <feFuncB type="gamma" amplitude="1.0" exponent="0.9" offset="0.12" />
      </feComponentTransfer>
    </>
  );
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const renderSepiaMatrix = (amount: number) => {
  // Sepia base matrix (amount=1) and identity (amount=0) interpolation.
  // Reference-ish matrix (common sepia transform)
  const t = clamp01(amount);

  const sepia = [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
    0, 0, 0, 1, 0,
  ];

  const identity = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ];

  const values = identity.map((v, i) => mix(v, sepia[i]!, t)).join(' ');
  return <feColorMatrix type="matrix" values={values} />;
};

const renderColorAdjustments = (color: ColorAdjustments | undefined, enableColor: boolean) => {
  if (!enableColor || !color) return null;

  const hueRotate = typeof color.hueRotate === 'number' ? color.hueRotate : undefined;
  const grayscale = typeof color.grayscale === 'number' ? clamp01(color.grayscale) : undefined;
  const sepia = typeof color.sepia === 'number' ? clamp01(color.sepia) : undefined;

  const saturateRaw = typeof color.saturate === 'number' ? color.saturate : undefined;
  const saturateByGray =
    typeof grayscale === 'number'
      ? // grayscale(1) ~= saturate(0)
        Math.max(0, 1 - grayscale)
      : undefined;

  const saturate =
    typeof saturateRaw === 'number' && typeof saturateByGray === 'number'
      ? saturateRaw * saturateByGray
      : typeof saturateRaw === 'number'
        ? saturateRaw
        : saturateByGray;

  const brightness = typeof color.brightness === 'number' ? color.brightness : undefined;
  const contrast = typeof color.contrast === 'number' ? color.contrast : undefined;
  const invert = typeof color.invert === 'number' ? clamp01(color.invert) : undefined;

  const contrastIntercept = typeof contrast === 'number' ? 0.5 * (1 - contrast) : undefined;
  const invertSlope = typeof invert === 'number' ? 1 - 2 * invert : undefined;
  const invertIntercept = typeof invert === 'number' ? invert : undefined;

  return (
    <>
      {typeof hueRotate === 'number' ? (
        <feColorMatrix type="hueRotate" values={String(hueRotate)} />
      ) : null}

      {typeof saturate === 'number' ? (
        <feColorMatrix type="saturate" values={String(saturate)} />
      ) : null}

      {typeof sepia === 'number' && sepia > 0 ? renderSepiaMatrix(sepia) : null}

      {typeof brightness === 'number' ? (
        <feComponentTransfer>
          <feFuncR type="linear" slope={brightness} intercept={0} />
          <feFuncG type="linear" slope={brightness} intercept={0} />
          <feFuncB type="linear" slope={brightness} intercept={0} />
        </feComponentTransfer>
      ) : null}

      {typeof contrast === 'number' ? (
        <feComponentTransfer>
          <feFuncR type="linear" slope={contrast} intercept={contrastIntercept ?? 0} />
          <feFuncG type="linear" slope={contrast} intercept={contrastIntercept ?? 0} />
          <feFuncB type="linear" slope={contrast} intercept={contrastIntercept ?? 0} />
        </feComponentTransfer>
      ) : null}

      {typeof invert === 'number' && invert > 0 ? (
        <feComponentTransfer>
          <feFuncR type="linear" slope={invertSlope ?? 1} intercept={invertIntercept ?? 0} />
          <feFuncG type="linear" slope={invertSlope ?? 1} intercept={invertIntercept ?? 0} />
          <feFuncB type="linear" slope={invertSlope ?? 1} intercept={invertIntercept ?? 0} />
        </feComponentTransfer>
      ) : null}
    </>
  );
};

const buildFilterCss = (filterId: string): CSSProperties => {
  // CSS filter는 SVG <filter id="..."> 를 참조할 수 있습니다.
  // Safari 등 일부 환경에서는 호환성 이슈가 있을 수 있어, 필요하면 추후 fallback(CSS filter)도 추가 가능합니다.
  return { filter: `url(#${filterId})` };
};

export function SVGFilteredImage(props: SVGFilteredImageProps) {
  const {
    src,
    alt,
    caption,
    className,
    wrapperClassName,
    rewriteSrc,
    color,
    enableColor = true,
    preset = 'none',
    children,
    priority,
    quality,
    ...rest
  } = props;

  const reactId = useId();
  const filterId = `svg-filter${reactId.replace(/:/g, '-')}`;
  const finalSrc = rewriteSrc ? rewriteSrc(src) ?? src : src;

  const filterPrimitives = children ?? renderPresetFilterPrimitives(preset);
  const colorPrimitives = renderColorAdjustments(color, enableColor);

  return (
    <figure
      className={cn(
        /* layout */
        'my-8',
        wrapperClassName,
      )}
    >
      {/* SVG filter 정의 (DOM 안에 존재해야 CSS url(#id) 참조가 동작합니다) */}
      <svg
        aria-hidden="true"
        className={cn(
          /* layout */
          'pointer-events-none absolute h-0 w-0',
        )}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {filterPrimitives}
            {colorPrimitives}
          </filter>
        </defs>
      </svg>

      <Image
        className={cn(
          /* shape */
          'rounded-xl',
          /* border & shadow */
          'border shadow-sm',
          /* border color */
          'border-zinc-200 dark:border-white/10',
          className,
        )}
        alt={alt}
        // next/image의 내부 img에 스타일이 전달됩니다.
        style={buildFilterCss(filterId)}
        priority={priority}
        quality={quality}
        src={finalSrc}
        {...(rest as Omit<ImageProps, keyof CommonProps>)}
      />

      {caption ? (
        <figcaption
          className={cn(
            /* layout */
            'mt-2 text-center',
            /* typography */
            'text-sm italic',
            /* color */
            'text-zinc-500 dark:text-zinc-400',
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}


