"use client";
import { useEffect } from "react";
import SplashProvider, {
  useSplash,
} from "@/components/providers/app/SplashProvider";
import { usePdfReader } from "@/store/course_context_menu/PdfStore";

// Sluit de splash zodra react-pdf het document inlaadde (PdfStore.docLoaded,
// gezet in PdfReader.onLoadSuccess). Draait binnen SplashProvider.
function DocumentSplashSync() {
  const { setLoaded } = useSplash();
  const docLoaded = usePdfReader((s) => s.docLoaded);

  useEffect(() => {
    if (docLoaded) setLoaded(true);
  }, [docLoaded, setLoaded]);

  return null;
}

export default function DocumentSplashWrapper({
  docId,
  children,
}: {
  docId: string;
  children: React.ReactNode;
}) {
  // key={docId} → remount per document, dus de splash komt bij elk nieuw
  // document opnieuw tot de pdf geladen is.
  // onTimeout leeg → na de timeout gewoon dismissen en op het document blijven
  // (geen redirect naar /home zoals bij een set/course).
  return (
    <SplashProvider key={docId} initialLoaded={false} onTimeout={() => {}}>
      <DocumentSplashSync />
      {children}
    </SplashProvider>
  );
}
