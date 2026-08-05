import { create } from "zustand";

export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.5;
export const ZOOM_STEP = 0.2;

const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

interface PdfReaderState {
  // document-meta
  doc_id: string;
  fileName: string;
  r2Key: string;
  // reader-state
  numPages: number;
  currentPage: number;
  pageCount: number;
  zoom: number;
  // acties
  setDoc: (doc: { doc_id: string; fileName: string; r2Key: string }) => void;
  setNumPages: (n: number) => void;
  setCurrentPage: (n: number) => void;
  setPageCount: (n: number) => void;
  setZoom: (z: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  reset: () => void;
}

const initial = {
  doc_id: "",
  fileName: "",
  r2Key: "",
  numPages: 0,
  currentPage: 1,
  pageCount: 0,
  zoom: 1,
};

// Centrale state voor de PDF-reader. PdfReader schrijft numPages/currentPage
// en leest zoom; bouw je eigen controls (bottombar, toolbar, ...) door deze
// store te lezen en de acties te callen.
export const usePdfReader = create<PdfReaderState>((set) => ({
  ...initial,
  setDoc: (doc) => set(doc),
  setNumPages: (n) => set({ numPages: n }),
  setCurrentPage: (n) => set({ currentPage: n }),
  setPageCount: (n) => set({ pageCount: n }),
  setZoom: (z) => set({ zoom: clampZoom(z) }),
  zoomIn: () => set((s) => ({ zoom: clampZoom(s.zoom + ZOOM_STEP) })),
  zoomOut: () => set((s) => ({ zoom: clampZoom(s.zoom - ZOOM_STEP) })),
  resetZoom: () => set({ zoom: 1 }),
  reset: () => set(initial),
}));
