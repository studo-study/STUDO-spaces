"use client";
import React, { useEffect, useId, useRef, useState } from "react";

const COMPOSER_AURA_CSS = `
  @keyframes ca-wash { 0%{ background-position: 0% 50% } 100%{ background-position: 300% 50% } }
  @keyframes ca-draw {
    0%   { stroke-dashoffset: 1; opacity: 0.65; }
    55%  { stroke-dashoffset: 0; opacity: 0.65; }
    72%  { stroke-dashoffset: 0; opacity: 0.65; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes ca-glow-flash {
    0%   { opacity: 0; }
    40%  { opacity: 0.3; }
    62%  { opacity: 0.3; }
    100% { opacity: 0; }
  }
  .ca-glow { background: linear-gradient(90deg, #6366f1, #c026d3, #fb7185, #38bdf8, #6366f1); background-size: 300% 100%; }
  @media (prefers-reduced-motion: reduce) { .ca-anim { animation: none !important; } }
`;

const COMPOSER_RADIUS = 32;

function composerTracePaths(
  w: number,
  h: number,
): { left: string; right: string } {
  const p = 0.75;
  const r = Math.max(0, Math.min(COMPOSER_RADIUS, Math.min(w, h) / 2 - p));
  const R = w - p;
  const B = h - p;
  const cx = w / 2;
  const right = `M ${cx} ${p} L ${R - r} ${p} A ${r} ${r} 0 0 1 ${R} ${p + r} L ${R} ${B - r} A ${r} ${r} 0 0 1 ${R - r} ${B} L ${cx} ${B}`;
  const left = `M ${cx} ${p} L ${p + r} ${p} A ${r} ${r} 0 0 0 ${p} ${p + r} L ${p} ${B - r} A ${r} ${r} 0 0 0 ${p + r} ${B} L ${cx} ${B}`;
  return { left, right };
}

interface ComposerAuraProps {
  planMode?: boolean;
  children: React.ReactNode;
  noGlow?: boolean;
}

export const ComposerAura: React.FC<ComposerAuraProps> = ({
  planMode = false,
  children,
  noGlow,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hasFlashed, setHasFlashed] = useState(false);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paths =
    size.w > 0 && size.h > 0 ? composerTracePaths(size.w, size.h) : null;
  const showBorder = !!paths && !hasFlashed;
  const showGlow = !noGlow && showBorder && !planMode;

  return (
    <div className="relative">
      <style>{COMPOSER_AURA_CSS}</style>
      {showGlow && (
        <div
          className="ca-anim ca-glow pointer-events-none absolute -inset-3 rounded-[44px] blur-2xl"
          style={{
            opacity: 0,
            animation:
              "ca-wash 9s linear infinite, ca-glow-flash 1.5s ease-out forwards",
          }}
          aria-hidden="true"
        />
      )}
      <div ref={ref} className="relative">
        {children}
        {showBorder && paths && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`ca-brand-${uid}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            {[paths.left, paths.right].map((d, i) => (
              <path
                key={`brand-${i}`}
                d={d}
                fill="none"
                stroke={`url(#ca-brand-${uid})`}
                strokeWidth={1.25}
                strokeLinecap="round"
                pathLength={1}
                className="ca-anim"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 0,
                  opacity: 0,
                  animation: "ca-draw 1.5s ease-out forwards",
                }}
                onAnimationEnd={() => setHasFlashed(true)}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

ComposerAura.displayName = "ComposerAura";
