// components/ui/AnimateOnMount.tsx
"use client"
import { useEffect, useState, ReactNode } from "react";

interface AnimateOnMountProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export default function AnimateOnMount({ children, delay = 0, className = "" }: AnimateOnMountProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} ${className}`}>
            {children}
        </div>
    );
}