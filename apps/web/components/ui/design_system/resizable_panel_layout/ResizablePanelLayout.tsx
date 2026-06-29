"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PanelConfig {
  id: string;
  defaultSize: number; // percentage 0-100
  minSize?: number; // percentage, default 5
  maxSize?: number; // percentage, default 95
}

export interface ResizablePanelLayoutProps {
  panels: PanelConfig[];
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  storageKey?: string;
  dividerSize?: number; // px, default 4
}

interface PanelProps {
  panelId: string;
  children: React.ReactNode;
}

// ─── Storage (keyed by panel id so order changes don't corrupt sizes) ─────────

function loadSizeMap(storageKey: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {
    /* ignore */
  }
  return {};
}

function saveSizeMap(storageKey: string, map: Record<string, number>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

// ─── Build size array for active panels, filling from stored map ──────────────

function buildSizes(
  activePanels: PanelConfig[],
  storedMap: Record<string, number>,
): number[] {
  // Start from stored sizes where available, else defaultSize
  const raw = activePanels.map((p) => storedMap[p.id] ?? p.defaultSize);

  // Normalise to sum=100, respecting min/max
  const total = raw.reduce((a, b) => a + b, 0);
  const scale = total > 0 ? 100 / total : 1;

  return raw.map((s, i) => {
    const min = activePanels[i].minSize ?? 5;
    const max = activePanels[i].maxSize ?? 95;
    return Math.min(max, Math.max(min, s * scale));
  });
}

// ─── Panel compound component ─────────────────────────────────────────────────

const Panel: React.FC<PanelProps> = ({ children }) => <>{children}</>;
Panel.displayName = "ResizablePanelLayout.Panel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPanelElement(
  node: React.ReactNode,
): node is React.ReactElement<PanelProps> {
  return (
    React.isValidElement(node) &&
    typeof (node.props as Record<string, unknown>).panelId === "string"
  );
}

// Extract rendered Panel children in order, skipping falsy (conditional renders)
function getActivePanelChildren(
  children: React.ReactNode,
): React.ReactElement<PanelProps>[] {
  return React.Children.toArray(children).filter(
    isPanelElement,
  ) as React.ReactElement<PanelProps>[];
}

// ─── Main component ───────────────────────────────────────────────────────────

const ResizablePanelLayoutBase: React.FC<ResizablePanelLayoutProps> = ({
  panels,
  children,
  direction = "horizontal",
  storageKey = "resizable-panel-layout",
  dividerSize = 4,
}) => {
  // Build lookup for quick config access
  const panelConfigMap = Object.fromEntries(panels.map((p) => [p.id, p]));

  // Active = Panel children currently rendered
  const activeChildren = getActivePanelChildren(children);
  const activeIds = activeChildren.map((c) => c.props.panelId);
  const activePanels = activeIds
    .map((id) => panelConfigMap[id])
    .filter(Boolean);

  const storedMapRef = useRef<Record<string, number>>(loadSizeMap(storageKey));

  const [sizes, setSizes] = useState<number[]>(() =>
    buildSizes(activePanels, storedMapRef.current),
  );

  // When active panel set changes, rebuild sizes
  const prevActiveIdsRef = useRef<string[]>(activeIds);
  useEffect(() => {
    const prev = prevActiveIdsRef.current;
    const same =
      prev.length === activeIds.length &&
      prev.every((id, i) => id === activeIds[i]);
    if (!same) {
      prevActiveIdsRef.current = activeIds;
      setSizes(buildSizes(activePanels, storedMapRef.current));
    }
  }, [activeIds.join(",")]); // eslint-disable-line

  // Persist sizes to map keyed by id
  useEffect(() => {
    activeIds.forEach((id, i) => {
      storedMapRef.current[id] = sizes[i];
    });
    saveSizeMap(storageKey, storedMapRef.current);
  }, [sizes, storageKey]); // eslint-disable-line

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingIndex = useRef<number | null>(null);
  const startPos = useRef(0);
  const startSizes = useRef<number[]>([]);

  const onMouseDown = useCallback(
    (dividerIndex: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      draggingIndex.current = dividerIndex;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSizes.current = [...sizes];
      document.body.style.cursor =
        direction === "horizontal" ? "ew-resize" : "ns-resize";
      document.body.style.userSelect = "none";
    },
    [sizes, direction],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingIndex.current === null || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerSize =
        direction === "horizontal" ? rect.width : rect.height;
      const usableSize =
        containerSize - (activePanels.length - 1) * dividerSize;
      if (usableSize <= 0) return;

      const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
      const deltaPercent = ((currentPos - startPos.current) / usableSize) * 100;

      const i = draggingIndex.current;
      const left = activePanels[i];
      const right = activePanels[i + 1];
      if (!left || !right) return;

      const leftMin = left.minSize ?? 5;
      const leftMax = left.maxSize ?? 95;
      const rightMin = right.minSize ?? 5;
      const rightMax = right.maxSize ?? 95;

      const combined = startSizes.current[i] + startSizes.current[i + 1];

      let newLeft = startSizes.current[i] + deltaPercent;
      let newRight = startSizes.current[i + 1] - deltaPercent;

      // Clamp left, adjust right to compensate
      if (newLeft < leftMin) {
        newLeft = leftMin;
        newRight = combined - leftMin;
      } else if (newLeft > leftMax) {
        newLeft = leftMax;
        newRight = combined - leftMax;
      }

      // Clamp right, adjust left to compensate
      if (newRight < rightMin) {
        newRight = rightMin;
        newLeft = combined - rightMin;
      } else if (newRight > rightMax) {
        newRight = rightMax;
        newLeft = combined - rightMax;
      }

      setSizes((prev) => {
        const next = [...prev];
        next[i] = newLeft;
        next[i + 1] = newRight;
        return next;
      });
    };

    const onMouseUp = () => {
      if (draggingIndex.current === null) return;
      draggingIndex.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activePanels, direction, dividerSize]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {activeChildren.map((child, i) => (
        <React.Fragment key={child.props.panelId}>
          <div
            style={{
              flex: sizes[i] ?? 0,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {child.props.children}
          </div>

          {i < activeChildren.length - 1 && (
            <div
              onMouseDown={onMouseDown(i)}
              style={{
                flexShrink: 0,
                flexGrow: 0,
                ...(isHorizontal
                  ? {
                      width: `${dividerSize}px`,
                      height: "100%",
                      cursor: "ew-resize",
                    }
                  : {
                      height: `${dividerSize}px`,
                      width: "100%",
                      cursor: "ns-resize",
                    }),
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

ResizablePanelLayoutBase.displayName = "ResizablePanelLayout";

// ─── Attach Panel as static property ─────────────────────────────────────────

const ResizablePanelLayout = Object.assign(ResizablePanelLayoutBase, { Panel });

export default ResizablePanelLayout;
