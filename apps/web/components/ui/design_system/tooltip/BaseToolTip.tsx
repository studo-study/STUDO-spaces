"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface BaseTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const BaseTooltip = ({
  children,
  content,
  position = "top",
  delay = 200,
}: BaseTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const posMap = {
        top: { top: rect.top - 8, left: rect.left + rect.width / 2 },
        bottom: { top: rect.bottom + 8, left: rect.left + rect.width / 2 },
        left: { top: rect.top + rect.height / 2, left: rect.left - 8 },
        right: { top: rect.top + rect.height / 2, left: rect.right + 8 },
      };
      setCoords(posMap[position]);
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const transformMap = {
    top: "translate(-50%, -100%)",
    bottom: "translate(-50%, 0%)",
    left: "translate(-100%, -50%)",
    right: "translate(0%, -50%)",
  };

  return (
    <div
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className="fixed z-[9999] whitespace-nowrap rounded-full border border-studoborder/30 bg-black/80 px-3 py-1.5 text-sm font-medium text-white shadow-lg pointer-events-none"
            style={{
              top: coords.top,
              left: coords.left,
              transform: transformMap[position],
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
};

BaseTooltip.displayName = "BaseTooltip";
export default BaseTooltip;
