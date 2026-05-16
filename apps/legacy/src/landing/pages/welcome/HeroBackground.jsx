import brain from "../../../assets/animations/animation assets/brain.svg";
import pencil from "../../../assets/animations/animation assets/pencil.svg";
import graduate from "../../../assets/animations/animation assets/graduate.svg";
import ruler from "../../../assets/animations/animation assets/ruler.svg";
import book from "../../../assets/animations/animation assets/book.svg";
import book2 from "../../../assets/animations/animation assets/book2.svg";
import { useEffect, useState } from "react";

const floatingItems = [
  { src: brain, size: "w-20", seed: 1 },
  { src: book2, size: "w-24", seed: 2 },
  { src: ruler, size: "w-16", seed: 3 },
  { src: graduate, size: "w-20", seed: 4 },
  { src: pencil, size: "w-18", seed: 5 },
  { src: book, size: "w-22", seed: 6 },
];

export default function HeroBackground({ color }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fixed max-w-screen w-full inset-0 overflow-hidden pointer-events-none">
      {/* Subtiele gradient overlay */}
      <div
        className={`absolute max-w-screen w-full inset-0 bg-gradient-to-b from-transparent via-transparent ${color}`}
      />

      {floatingItems.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt=""
          className={`absolute ${item.size} floating-blob ${mounted ? "animate" : ""}`}
          style={{
            "--seed": item.seed,
            "--start-x": `${Math.random() * 80 + 10}%`,
            "--start-y": `${Math.random() * 80 + 10}%`,
            "--duration": `${80 + Math.random() * 200}s`,
            "--rotate": `${Math.random() > 0.5 ? "" : "-"}${Math.random() * 720 + 180}deg`,
            "--scale-min": 0.7 + Math.random() * 0.4,
            "--scale-max": 1.0 + Math.random() * 0.5,

            opacity: mounted ? 0.2 : 0,
            left: "var(--start-x)",
            top: "var(--start-y)",
          }}
        />
      ))}
    </section>
  );
}
