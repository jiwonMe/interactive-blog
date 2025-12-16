"use client";

import React from "react";

export interface ImageInfo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function useImageUpload() {
  const [uploadedImage, setUploadedImage] = React.useState<ImageInfo | null>(null);
  const [unsplashImage, setUnsplashImage] = React.useState<ImageInfo | null>(null);
  const [isLoadingUnsplash, setIsLoadingUnsplash] = React.useState(false);

  const handleFileUpload = React.useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        const img = new Image();
        img.onload = () => {
          setUploadedImage({
            src: result,
            alt: file.name,
            width: img.width,
            height: img.height,
          });
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const loadRandomUnsplashImage = React.useCallback(async () => {
    setIsLoadingUnsplash(true);
    try {
      // Picsum Photos를 사용하여 랜덤 이미지 가져오기 (API 키 불필요)
      // 더 나은 해상도를 위해 1920x1080 사용
      const width = 1920;
      const height = 1080;
      const randomSeed = Date.now();
      const imageUrl = `https://picsum.photos/${width}/${height}?random=${randomSeed}`;

      // 이미지 로드 및 크기 확인
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("이미지 로드 타임아웃"));
        }, 10000); // 10초 타임아웃

        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
        img.src = imageUrl;
      });

      setUnsplashImage({
        src: imageUrl,
        alt: "랜덤 이미지",
        width: img.width || width,
        height: img.height || height,
      });
    } catch (error) {
      console.error("랜덤 이미지 로드 실패:", error);
      alert("랜덤 이미지를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoadingUnsplash(false);
    }
  }, []);

  const clearCustomImage = React.useCallback(() => {
    setUploadedImage(null);
    setUnsplashImage(null);
  }, []);

  return {
    uploadedImage,
    unsplashImage,
    isLoadingUnsplash,
    handleFileUpload,
    loadRandomUnsplashImage,
    clearCustomImage,
  };
}

