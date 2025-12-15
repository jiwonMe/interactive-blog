"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SVGFilteredImage, type SVGFilteredImageProps } from "./SVGFilteredImage";

type DarkPreset = "invert-hue-180";

export type DarkmodeImageProps = Omit<SVGFilteredImageProps, "preset"> & {
  /**
   * 다크모드일 때 적용할 preset
   */
  darkPreset?: DarkPreset;
  /**
   * 라이트모드일 때 적용할 preset
   * 기본값: none
   */
  lightPreset?: "none" | "blur" | "noise" | "duotone";
};

export function DarkmodeImage({
  darkPreset = "invert-hue-180",
  lightPreset = "none",
  ...rest
}: DarkmodeImageProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <SVGFilteredImage
      {...rest}
      preset={isDark ? darkPreset : lightPreset}
    />
  );
}


