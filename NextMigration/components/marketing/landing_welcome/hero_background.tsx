"use client"
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

const floatingItems = [
    { src: "/animations/animation_assets/brain.svg", size: "w-20", seed: 1 },
    { src: "/animations/animation_assets/book2.svg", size: "w-24", seed: 2 },
    { src: "/animations/animation_assets/ruler.svg", size: "w-16", seed: 3 },
    { src: "/animations/animation_assets/graduate.svg", size: "w-20", seed: 4 },
    { src: "/animations/animation_assets/pencil.svg", size: "w-18", seed: 5 },
    { src: "/animations/animation_assets/book.svg", size: "w-22", seed: 6 }
];

// Genereer vaste waarden BUITEN de component
const randomValues = floatingItems.map((item) => ({
    ...item,
    startX: `${(item.seed * 13.7) % 80 + 10}%`,  // pseudo-random gebaseerd op seed
    startY: `${(item.seed * 17.3) % 80 + 10}%`,
    duration: `${80 + (item.seed * 23.1) % 200}s`,
    rotate: `${item.seed % 2 === 0 ? "" : "-"}${(item.seed * 97.3) % 720 + 180}deg`,
    scaleMin: 0.7 + (item.seed * 0.067) % 0.4,
    scaleMax: 1.0 + (item.seed * 0.083) % 0.5,
}));

interface HeroBackgroundProps {
    color: string;
}

export default function HeroBackground({ color }: HeroBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="fixed max-w-screen w-full inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute max-w-screen w-full inset-0 bg-gradient-to-b from-transparent via-transparent ${color}`} />

            {randomValues.map((item, i) => (
                <Image
                    key={i}
                    src={item.src}
                    alt=""
                    height={0}
                    width={0}
                    className={`absolute ${item.size} floating-blob ${mounted ? 'animate' : ''}`}
                    style={{
                        "--seed": item.seed,
                        "--start-x": item.startX,
                        "--start-y": item.startY,
                        "--duration": item.duration,
                        "--rotate": item.rotate,
                        "--scale-min": item.scaleMin,
                        "--scale-max": item.scaleMax,
                        opacity: mounted ? 0.2 : 0,
                        left: "var(--start-x)",
                        top: "var(--start-y)"
                    } as React.CSSProperties}
                />
            ))}
        </section>
    );
}