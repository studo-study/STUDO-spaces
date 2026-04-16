"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
    useEffect(() => {
        console.log(`
███████╗████████╗██╗   ██╗██████╗  ██████╗
██╔════╝╚══██╔══╝██║   ██║██╔══██╗██╔═══██╗
███████╗   ██║   ██║   ██║██║  ██║██║   ██║
╚════██║   ██║   ██║   ██║██║  ██║██║   ██║
███████║   ██║   ╚██████╔╝██████╔╝╚██████╔╝
╚══════╝   ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝

> What are you doing here? 🤨
> This place is for developers only.
`);
    }, []);

    return null;
}
