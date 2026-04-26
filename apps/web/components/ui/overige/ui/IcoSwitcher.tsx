"use client"
import { useEffect, useState } from "react";

const IcoSwitcher = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
            || document.createElement("link");
        link.rel = "icon";
        link.href = isDark ? "/favicons/favicon-dark.ico" : "/favicons/favicon-light.ico";
        document.head.appendChild(link);
    }, [isDark]);

    return null;
}

IcoSwitcher.displayName = "IcoSwitcher";
export default IcoSwitcher;