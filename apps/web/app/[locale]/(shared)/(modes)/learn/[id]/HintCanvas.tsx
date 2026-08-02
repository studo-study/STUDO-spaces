"use client";
import classNames from "@/utils/classnames";
import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface HintCanvasProps {
  currentCard: string;
}

const HintCanvas: React.FC<HintCanvasProps> = (props) => {
  const { currentCard } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const firstLetter = currentCard.slice(0, 1);
  const length = currentCard.length - 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let rafId: number;

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width = r.width * dpr;
      canvas!.height = r.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((r.width * r.height) / 5);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      }));
    }

    const darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    function draw() {
      const r = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, r.width, r.height);
      ctx!.fillStyle = darkmode ? "#FFFFFF" : "#111827";

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > r.width) p.vx *= -1;
        if (p.y < 0 || p.y > r.height) p.vy *= -1;
        ctx!.fillRect(p.x, p.y, 1, 1);
      }
      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [currentCard]);

  return (
    <div
      className={
        " max-w-50 w-fit relative flex flex-row max-h-fit items-center"
      }
    >
      <span>{firstLetter}</span>
      <canvas
        ref={canvasRef}
        style={{
          width: length + "ch",
          height: "1.3ch",
          transition: "opacity 0.25s",
        }}
        className={classNames("h-full opacity-50")}
      ></canvas>
    </div>
  );
};

HintCanvas.displayName = "HintCanvas";
export default HintCanvas;
