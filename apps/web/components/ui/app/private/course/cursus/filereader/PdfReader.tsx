"use client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { FullCourseDocument } from "@studo/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, FileWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePdfReader } from "@/store/course_context_menu/PdfStore";

// worker self-gehost in /public (Turbopack kan de bare specifier in new URL()
// niet resolven; bestand komt uit pdfjs-dist/build, versie 5.4.296).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ~A4 op 96dpi (210mm ≈ 794px); lees-breedte, niet uitgerekt
const MAX_WIDTH = 794;
const A4_RATIO = 1 / 1.4142; // width / height (210 × 297 mm)

interface PdfReaderProps {
  file: FullCourseDocument;
}

const PdfReader: React.FC<PdfReaderProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("flow.course");

  // reader-state komt uit de store; bouw je eigen controls erbovenop.
  const numPages = usePdfReader((s) => s.numPages);
  const zoom = usePdfReader((s) => s.zoom);
  const setNumPages = usePdfReader((s) => s.setNumPages);
  const setCurrentPage = usePdfReader((s) => s.setCurrentPage);
  const setZoom = usePdfReader((s) => s.setZoom);
  const setDoc = usePdfReader((s) => s.setDoc);
  const reset = usePdfReader((s) => s.reset);

  const [containerWidth, setContainerWidth] = useState(0);

  // store vullen met dit document; opruimen bij verlaten
  useEffect(() => {
    setDoc({ doc_id: file.id, fileName: file.title, r2Key: file.storageKey });
    setNumPages(file.pageCount ?? 0);
    return () => reset();
  }, [
    file.id,
    file.title,
    file.storageKey,
    file.pageCount,
    setDoc,
    setNumPages,
    reset,
  ]);

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

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // trackpad-pinch komt binnen als ctrl+wheel
      e.preventDefault();
      setZoom(zoomRef.current - e.deltaY * 0.01);
    };

    let startDist = 0;
    let startZoom = 1;
    const dist = (touches: TouchList) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      startDist = dist(e.touches);
      startZoom = zoomRef.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || startDist === 0) return;
      e.preventDefault();
      setZoom(startZoom * (dist(e.touches) / startDist));
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
  }, [setZoom]);

  // welke pagina staat in beeld → store.currentPage
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
    [setCurrentPage],
  );

  const pageWidth = Math.min(containerWidth - 60, MAX_WIDTH) * zoom;

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "pan-x pan-y" }}
      className="relative w-full h-full min-h-0 flex-1 overflow-auto flex flex-col items-center scroll-hidden gap-6 py-8 bg-studogrey/5 dark:bg-bg-dark"
    >
      <Document
        file={file.url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex min-h-0 flex-1 items-center justify-center h-full w-full text-studodarkblue/50 dark:text-white/50">
            <LoaderCircle size={18} className="animate-spin" />
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center w-full text-studodarkblue/50 dark:text-white/50">
            <div className={"flex flex-col items-center"}>
              <FileWarning size={22} />
              <span className="text-sm">{t("doc_error")}</span>
            </div>
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
    </div>
  );
};

PdfReader.displayName = "PdfReader";
export default PdfReader;
