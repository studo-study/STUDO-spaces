import { create } from "zustand";

interface PdfReader {
  doc_id: string;
  fileName: string;
  r2Key: string;
  currentPage: number;
  pageCount: number;
}
export const usePdfReader = create<PdfReader>(() => ({
  doc_id: "",
  fileName: "",
  r2Key: "",
  currentPage: 0,
  pageCount: 0,
}));
