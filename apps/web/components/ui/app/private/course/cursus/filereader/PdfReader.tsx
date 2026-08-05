"use client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { FullCourseDocument } from "@studo/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Minus, Plus, FileWarning } from "lucide-react";

// worker self-gehost in /public (Turbopack kan de bare specifier in new URL()
// niet resolven; bestand komt uit pdfjs-dist/build, versie 5.4.296).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ~A4 op 96dpi (210mm ≈ 794px); lees-breedte, niet uitgerekt
const MAX_WIDTH = 794;
const A4_RATIO = 1 / 1.4142; // width / height (210 × 297 mm)
const ZOOM_STEP = 0.2;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.5;

interface PdfReaderProps {
  file: FullCourseDocument;
}

const PdfReader: React.FC<PdfReaderProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(file?.pageCount ?? 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  // spiegel van zoom zodat de gesture-listeners de actuele waarde lezen
  // zonder her-attachen (anders breekt de pinch mid-gesture).
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // container-breedte volgen zodat paginas responsive schalen.
  // clientWidth i.p.v. contentRect.width → scrollbar wordt afgetrokken,
  // anders zijn de paginas net te breed en clippen ze horizontaal.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pinch-zoom: trackpad (wheel + ctrlKey) en touch (twee vingers).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const clamp = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // trackpad-pinch komt binnen als ctrl+wheel
      e.preventDefault();
      setZoom((z) => clamp(z - e.deltaY * 0.01));
    };

    let startDist = 0;
    let startZoom = 1;
    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      startDist = dist(e.touches);
      startZoom = zoomRef.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || startDist === 0) return;
      e.preventDefault();
      setZoom(clamp(startZoom * (dist(e.touches) / startDist)));
    };
    const onTouchEnd = () => {
      startDist = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // welke pagina staat in beeld → indicator
  const registerPage = useCallback(
    (node: HTMLDivElement | null, pageNumber: number) => {
      if (!node) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentPage(pageNumber);
        },
        { threshold: 0.5 },
      );
      io.observe(node);
      return () => io.disconnect();
    },
    [],
  );

  const pageWidth = Math.min(containerWidth - 60, MAX_WIDTH) * zoom;

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "pan-x pan-y" }}
      className="relative w-full h-full overflow-auto flex flex-col items-center gap-6 py-8 bg-studogrey/5 dark:bg-bg-dark"
    >
      <Document
        file={file.url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex h-full items-center justify-center text-studodarkblue/50 dark:text-white/50">
            <LoaderCircle size={18} className="animate-spin" />
          </div>
        }
        error={
          <div className="flex h-full flex-col items-center justify-center gap-2 text-studodarkblue/60 dark:text-white/60">
            <FileWarning size={22} />
            <span className="text-sm">Kon document niet laden</span>
          </div>
        }
        className="flex flex-col items-center gap-6"
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            ref={(node) => void registerPage(node, i + 1)}
            className="overflow-hidden shadow-lg rounded-xl border border-studoborder/30"
          >
            <Page
              pageNumber={i + 1}
              width={pageWidth > 0 ? pageWidth : undefined}
              renderTextLayer
              renderAnnotationLayer={false}
              loading={
                <div
                  style={{ width: pageWidth, aspectRatio: A4_RATIO }}
                  className="flex items-center justify-center bg-studogrey/10"
                >
                  <LoaderCircle
                    size={16}
                    className="animate-spin text-studodarkblue/40 dark:text-white/40"
                  />
                </div>
              }
            />
          </div>
        ))}
      </Document>

      {/* zwevende toolbar */}
      {numPages > 0 && (
        <div className="pointer-events-auto sticky bottom-4 z-10 mt-auto flex items-center gap-1 rounded-full glass-rgb px-2 py-1.5 text-sm text-studodarkblue dark:text-white shadow-lg">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
            disabled={zoom <= ZOOM_MIN}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
            disabled={zoom >= ZOOM_MAX}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <Plus size={16} />
          </button>
          <div className="mx-1 h-5 w-px bg-studoborder/50" />
          <span className="px-2 tabular-nums text-studodarkblue/70 dark:text-white/70">
            {currentPage} / {numPages}
          </span>
        </div>
      )}
    </div>
  );
};

PdfReader.displayName = "PdfReader";
export default PdfReader;
