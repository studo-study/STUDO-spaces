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
  // true zodra react-pdf het document effectief inlaadde (onLoadSuccess)
  docLoaded: boolean;
  // acties — per veld
  setDocId: (id: string) => void;
  setFileName: (name: string) => void;
  setR2Key: (key: string) => void;
  setDocLoaded: (v: boolean) => void;
  setNumPages: (n: number) => void;
  setCurrentPage: (n: number) => void;
  setPageCount: (n: number) => void;
  setZoom: (z: number) => void;
  // acties — samengesteld
  setDoc: (doc: { doc_id: string; fileName: string; r2Key: string }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  reset: () => void;
  // generieke partiële update (typed alternatief voor usePdfReader.setState)
  set: (partial: Partial<PdfReaderState>) => void;
}

const initial = {
  doc_id: "",
  fileName: "",
  r2Key: "",
  numPages: 0,
  currentPage: 1,
  pageCount: 0,
  zoom: 1,
  docLoaded: false,
};

// Centrale state voor de PDF-reader. PdfReader schrijft numPages/currentPage
// en leest zoom; bouw je eigen controls (bottombar, toolbar, ...) door deze
// store te lezen en de acties te callen.
export const usePdfReader = create<PdfReaderState>((set) => ({
  ...initial,
  // per veld
  setDocId: (id) => set({ doc_id: id }),
  setFileName: (name) => set({ fileName: name }),
  setR2Key: (key) => set({ r2Key: key }),
  setDocLoaded: (v) => set({ docLoaded: v }),
  setNumPages: (n) => set({ numPages: n }),
  setCurrentPage: (n) => set({ currentPage: n }),
  setPageCount: (n) => set({ pageCount: n }),
  setZoom: (z) => set({ zoom: clampZoom(z) }),
  // samengesteld
  setDoc: (doc) => set(doc),
  zoomIn: () => set((s) => ({ zoom: clampZoom(s.zoom + ZOOM_STEP) })),
  zoomOut: () => set((s) => ({ zoom: clampZoom(s.zoom - ZOOM_STEP) })),
  resetZoom: () => set({ zoom: 1 }),
  reset: () => set(initial),
  // generiek
  set: (partial) => set(partial),
}));
