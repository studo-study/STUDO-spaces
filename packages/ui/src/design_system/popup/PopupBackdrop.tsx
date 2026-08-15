"use client";
import { createPortal } from "react-dom";
import usePortalMounted from "@studo/ui/design_system/popup/useSyncExternalStore";

interface PopupBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  blur?: boolean;
}

const PopupBackdrop = (props: PopupBackdropProps) => {
  const { isOpen, setIsOpen, children, blur } = props;

  // Portal enkel na client-mount; `document` bestaat niet tijdens SSR.
  const mounted = usePortalMounted();
  if (!mounted) return null;

  return createPortal(
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 flex items-baseline justify-center pt-80 w-screen bg-black/50 h-screen z-99999 ${blur && "backdrop-blur-xl"}
        ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {children}
    </div>,
    document.body,
  );
};

PopupBackdrop.displayName = "PopupBackdrop";
export default PopupBackdrop;
