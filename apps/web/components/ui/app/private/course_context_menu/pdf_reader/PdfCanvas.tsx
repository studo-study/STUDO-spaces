"use client";
import { useEffect, useRef, useState } from "react";

interface PdfPageProps {
  width: number;
  pageRef?: React.Ref<HTMLDivElement>;
}

const PdfPage: React.FC<PdfPageProps> = ({ width, pageRef }) => {
  const height = width * 1.414;

  return (
    <div
      ref={pageRef}
      style={{ width, height }}
      className={"bg-white border rounded-xl border-studoborder/30 shrink-0"}
    />
  );
};

const PdfCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pageWidth = Math.min(width * 0.65, 700);

  return (
    <div
      ref={containerRef}
      className={
        "w-full flex flex-col items-center gap-4 p-4 pb-10 scroll-hidden"
      }
    >
      {pageWidth > 0 && <PdfPage width={pageWidth} />}
      {pageWidth > 0 && <PdfPage width={pageWidth} />}
      {pageWidth > 0 && <PdfPage width={pageWidth} />}
      {pageWidth > 0 && <PdfPage width={pageWidth} />}
    </div>
  );
};

PdfCanvas.displayName = "PdfCanvas";
export default PdfCanvas;
