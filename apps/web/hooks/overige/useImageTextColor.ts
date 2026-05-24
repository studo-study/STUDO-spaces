"use client";

import { useState, useEffect, useRef } from "react";
import { FastAverageColor } from "fast-average-color";

interface Options {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function useImageTextColor(src: string, area: Options) {
  const [isDark, setIsDark] = useState(true); // veilige default
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous"; // nodig voor externe urls
    img.src = src;
    imgRef.current = img;

    const fac = new FastAverageColor();

    const handleLoad = () => {
      try {
        const color = fac.getColor(img, area);
        setIsDark(color.isDark);
      } catch (e) {
        console.error("kon kleur niet uitlezen", e);
      }
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      fac.destroy();
    };
  }, [src, area.left, area.top, area.width, area.height, area]);

  return isDark;
}
