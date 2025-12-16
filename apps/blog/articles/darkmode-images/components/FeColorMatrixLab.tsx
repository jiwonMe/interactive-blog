"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { SVGFilteredImage } from "../../../components/mdx-components/SVGFilteredImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { IMAGE_OPTIONS, PRESETS, identityMatrix, parseValuesString, toValuesString, type ImageKey, type Matrix4x5, type PresetKey } from "./feColorMatrixLabData";
import { FeColorMatrixMatrixEditor } from "./FeColorMatrixMatrixEditor";
import { FeColorMatrixValuesEditor } from "./FeColorMatrixValuesEditor";
import { ImageSelector } from "./ImageSelector";
import { type ImageInfo } from "./useImageUpload";

export interface FeColorMatrixLabProps {
  defaultImage?: ImageKey;
  defaultPreset?: PresetKey;
}

export function FeColorMatrixLab({
  defaultImage = "la-nina",
  defaultPreset = "identity",
}: FeColorMatrixLabProps) {
  const [selectedImage, setSelectedImage] = React.useState<ImageKey>(defaultImage);
  const [customImage, setCustomImage] = React.useState<ImageInfo | null>(null);
  const imageOption = IMAGE_OPTIONS.find((o) => o.value === selectedImage) ?? IMAGE_OPTIONS[0]!;

  // 커스텀 이미지가 있으면 그것을 사용, 없으면 기본 이미지 사용
  const src = customImage?.src ?? imageOption.src;
  const width = customImage?.width ?? imageOption.width;
  const height = customImage?.height ?? imageOption.height;
  const alt = customImage?.alt ?? imageOption.label;

  const [preset, setPreset] = React.useState<PresetKey>(defaultPreset);
  const [matrix, setMatrix] = React.useState<Matrix4x5>(() => PRESETS[defaultPreset]?.values ?? identityMatrix());
  const [rawText, setRawText] = React.useState<string>(() => toValuesString(matrix));
  const [copyState, setCopyState] = React.useState<"idle" | "copied">("idle");
  const autoApplyTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const next = PRESETS[preset]?.values ?? identityMatrix();
    setMatrix(next);
    setRawText(toValuesString(next));
  }, [preset]);

  const updateCell = (row: number, col: number, next: number) => {
    setPreset("identity");
    setMatrix((prev) => {
      const copy = [...prev] as Matrix4x5;
      const safe = Number.isFinite(next) ? next : 0;
      copy[row * 5 + col] = safe;
      setRawText(toValuesString(copy));
      return copy;
    });
  };

  // values textarea는 "자동 적용" (디바운스)로 동작
  React.useEffect(() => {
    if (autoApplyTimerRef.current) {
      window.clearTimeout(autoApplyTimerRef.current);
    }

    autoApplyTimerRef.current = window.setTimeout(() => {
      const parsed = parseValuesString(rawText);
      setMatrix(parsed);
    }, 150);

    return () => {
      if (autoApplyTimerRef.current) window.clearTimeout(autoApplyTimerRef.current);
    };
  }, [rawText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 900);
    } catch {
      // clipboard API가 막혀있어도 UI는 죽지 않게 둠
      setCopyState("idle");
    }
  };

  return (
    <div
      className={cn(
        /* layout */
        "my-10 w-full",
        "space-y-6",
      )}
    >
      <div
        className={cn(
          /* layout */
          "rounded-2xl",
          "px-3 py-4",
          "sm:px-4 sm:py-5",
          "md:p-6",
          "space-y-5",
          /* background */
          "bg-zinc-50 dark:bg-zinc-900",
          /* border */
          "border border-zinc-200 dark:border-zinc-800",
        )}
      >
        <div
          className={cn(
            /* layout */
            "flex flex-row gap-4",
            "sm:flex-row sm:items-end sm:justify-between",
            /* size */
            "h-[100px]"
          )}
        >
          <div
            className={cn(
              /* layout */
              "min-w-0",
            )}
          >
            <p
              className={cn(
                /* typography */
                "text-sm font-semibold",
                /* color */
                "text-zinc-900 dark:text-zinc-100",
              )}
            >
              feColorMatrix playground
            </p>
            <p
              className={cn(
                /* typography */
                "mt-1 text-xs leading-relaxed",
                /* color */
                "text-zinc-600 dark:text-zinc-400",
              )}
            >
              4×5(총 20개) 값을 바꾸면 바로 이미지에 적용된다. 값은 공백/쉼표로 구분 가능하다.
            </p>
          </div>

          <div
            className={cn(
              /* layout */
              "flex flex-col gap-4",
              "sm:flex-row sm:items-start",
              /* width */
              "sm:w-full",
              "md:max-w-[40rem]",
            )}
          >
            <div
              className={cn(
                /* layout */
                "flex-1 min-w-0",
                /* spacing */
                "space-y-1.5",
              )}
            >
              <ImageSelector
                options={IMAGE_OPTIONS}
                selectedValue={selectedImage}
                onValueChange={(value) => {
                  setSelectedImage(value as ImageKey);
                  setCustomImage(null);
                }}
                onImageSelect={setCustomImage}
                label="이미지"
              />
            </div>

            <div
              className={cn(
                /* layout */
                "flex-shrink-0",
                /* spacing */
                "space-y-1.5",
                /* width */
                "w-full sm:w-[12rem]",
              )}
            >
              <p
                className={cn(
                  /* typography */
                  "text-xs font-medium",
                  /* color */
                  "text-zinc-700 dark:text-zinc-300",
                )}
              >
                preset
              </p>
              <Select value={preset} onValueChange={(v) => setPreset(v as PresetKey)}>
                <SelectTrigger
                  className={cn(
                    /* layout */
                    "w-full"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <SelectItem key={key} value={key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div
          className={cn(
            /* layout */
            "grid gap-6",
            "lg:grid-cols-2",
          )}
        >
          <div
            className={cn(
              /* layout */
              "space-y-3",
            )}
          >
            <FeColorMatrixMatrixEditor
              matrix={matrix}
              description={PRESETS[preset]?.description ?? "커스텀"}
              onReset={() => {
                setPreset("identity");
                const next = identityMatrix();
                setMatrix(next);
                setRawText(toValuesString(next));
              }}
              onChangeCell={updateCell}
            />
            <FeColorMatrixValuesEditor
              rawText={rawText}
              onRawTextChange={(next) => {
                setPreset("identity");
                setRawText(next);
              }}
              onCopy={handleCopy}
              copyState={copyState}
            />
          </div>

          <div
            className={cn(
              /* layout */
              "flex flex-col",
            )}
          >
            <div
              className={cn(
                /* layout */
                "rounded-xl p-4",
                /* background */
                "bg-white dark:bg-zinc-950",
                /* border */
                "border border-zinc-200 dark:border-zinc-800",
                /* layout */
                "flex-1 flex items-center justify-center",
              )}
            >
              <SVGFilteredImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                wrapperClassName={cn(
                  /* layout */
                  "my-0 w-full",
                )}
              >
                <feColorMatrix type="matrix" values={toValuesString(matrix)} />
              </SVGFilteredImage>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


