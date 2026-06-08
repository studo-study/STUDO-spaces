"use client";
import { useSyncExternalStore } from "react";
import Image from "next/image";

const floatingItems = [
  { src: "/animations/animation_assets/brain.svg", size: "w-20", seed: 1 },
  { src: "/animations/animation_assets/book2.svg", size: "w-24", seed: 2 },
  { src: "/animations/animation_assets/ruler.svg", size: "w-16", seed: 3 },
  { src: "/animations/animation_assets/graduate.svg", size: "w-20", seed: 4 },
  { src: "/animations/animation_assets/pencil.svg", size: "w-18", seed: 5 },
  { src: "/animations/animation_assets/book.svg", size: "w-22", seed: 6 },
];

const randomValues = floatingItems.map((item) => ({
  ...item,
  startX: `${((item.seed * 13.7) % 80) + 10}%`,
  startY: `${((item.seed * 17.3) % 80) + 10}%`,
  duration: `${80 + ((item.seed * 23.1) % 200)}s`,
  rotate: `${item.seed % 2 === 0 ? "" : "-"}${((item.seed * 97.3) % 720) + 180}deg`,
  scaleMin: 0.7 + ((item.seed * 0.067) % 0.4),
  scaleMax: 1.0 + ((item.seed * 0.083) % 0.5),
}));

interface HeroBackgroundProps {
  color: string;
  paused: boolean;
}

export default function HeroBackground({ paused, color }: HeroBackgroundProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <section className="fixed max-w-screen w-full inset-0 overflow-hidden pointer-events-none">
      {/* Subtiele achtergrondlichten — enkel zichtbaar als ambiance */}
      <div className="absolute -top-[15%] -right-[5%] w-[800px] h-[800px] rounded-full bg-blue-400/8 dark:bg-blue-400/6 blur-[160px]" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[700px] h-[700px] rounded-full bg-emerald-400/7 dark:bg-emerald-400/5 blur-[140px]" />

      <div
        className={`absolute max-w-screen w-full inset-0 bg-gradient-to-b from-transparent via-transparent ${paused ? "animation-paused" : ""} ${color}`}
      />

      {randomValues.map((item, i) => (
        <Image
          key={i}
          src={item.src}
          alt=""
          height={0}
          width={0}
          className={`absolute ${item.size} floating-blob ${mounted ? "animate" : ""}`}
          style={
            {
              "--seed": item.seed,
              "--start-x": item.startX,
              "--start-y": item.startY,
              "--duration": item.duration,
              "--rotate": item.rotate,
              "--scale-min": item.scaleMin,
              "--scale-max": item.scaleMax,
              opacity: mounted ? 0.15 : 0,
              left: "var(--start-x)",
              top: "var(--start-y)",
            } as React.CSSProperties
          }
        />
      ))}
    </section>
  );
}
