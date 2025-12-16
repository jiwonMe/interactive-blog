"use client";

import React from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useImageUpload, type ImageInfo } from "./useImageUpload";

export interface ImageOption {
  value: string;
  label: string;
  src: string;
  width: number;
  height: number;
}

export interface ImageSelectorProps {
  options: readonly ImageOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onImageSelect?: (image: ImageInfo) => void;
  label?: string;
  className?: string;
}

export function ImageSelector({
  options,
  selectedValue,
  onValueChange,
  onImageSelect,
  label = "이미지",
  className,
}: ImageSelectorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {
    uploadedImage,
    unsplashImage,
    isLoadingUnsplash,
    handleFileUpload,
    loadRandomUnsplashImage,
    clearCustomImage,
  } = useImageUpload();

  const hasCustomImage = uploadedImage || unsplashImage;
  const customImage = uploadedImage || unsplashImage;

  React.useEffect(() => {
    if (onImageSelect) {
      onImageSelect(customImage || null);
    }
  }, [customImage, onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // 파일 선택 후 input 초기화하여 같은 파일도 다시 선택 가능하게
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUnsplashClick = () => {
    loadRandomUnsplashImage();
  };

  const handleClearCustomImage = () => {
    clearCustomImage();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label
        className={cn(
          /* typography */
          "block text-xs font-medium",
          /* color */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        {label}
      </label>

      {/* 기본 이미지 선택 */}
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            /* layout */
            "w-full"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 커스텀 이미지 옵션 */}
      <div
        className={cn(
          /* layout */
          "flex gap-2"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          className={cn(
            /* layout */
            "flex-1"
          )}
        >
          <Upload
            className={cn(
              /* size */
              "mr-2 h-4 w-4"
            )}
          />
          업로드
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUnsplashClick}
          disabled={isLoadingUnsplash}
          className={cn(
            /* layout */
            "flex-1"
          )}
        >
          <ImageIcon
            className={cn(
              /* size */
              "mr-2 h-4 w-4"
            )}
          />
          {isLoadingUnsplash ? "로딩..." : "랜덤"}
        </Button>
      </div>

      {/* 커스텀 이미지 표시 및 제거 */}
      {hasCustomImage && (
        <div
          className={cn(
            /* layout */
            "flex items-center justify-between rounded-lg border p-2",
            /* background */
            "bg-zinc-50 dark:bg-zinc-800",
            /* border */
            "border-zinc-200 dark:border-zinc-700"
          )}
        >
          <span
            className={cn(
              /* typography */
              "text-xs",
              /* color */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {uploadedImage ? "업로드된 이미지" : "랜덤 이미지"} 사용 중
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearCustomImage}
            className={cn(
              /* layout */
              "h-6 w-6 p-0"
            )}
          >
            <X
              className={cn(
                /* size */
                "h-3 w-3"
              )}
            />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

