import universityData from "@/components/app/flow/page/CoursePage/KnownLinks";
import {FcGoogle} from "react-icons/fc";

export function Linkparser(link: string) {
    if (!link) return { name: "Onbekend", icon: "default-link" };

    const lowerLink = link.toLowerCase();

    // 1. Check voor PDF's
    if (lowerLink.endsWith(".pdf") || lowerLink.includes("/pdf/")) {
        return { name: "Document", icon: "pdf-icon" };
    }

    // 2. Check voor Google (Drive, Docs, Search)
    if (lowerLink.includes("google.com")) {
        if (lowerLink.includes("drive.google")) return { name: "Google Drive", icon: <FcGoogle /> };
        if (lowerLink.includes("docs.google")) return { name: "Google Docs", icon: <FcGoogle /> };
        return { name: "Google Search", icon: <FcGoogle /> };
    }

    // 3. Match Universiteit/Hogeschool data
    for (const instelling of universityData) {
        if (instelling.patterns.some(pattern => lowerLink.includes(pattern))) {
            return {
                name: instelling.name,
                icon: instelling.icon
            };
        }
    }

    // 4. Generieke CMS detectie (als de school niet in de lijst staat maar wel Canvas/Moodle gebruikt)
    if (lowerLink.includes("instructure.com")) return { name: "Canvas", icon: "canvas-generic" };
    if (lowerLink.includes("moodle")) return { name: "Moodle", icon: "moodle-generic" };
    if (lowerLink.includes("brightspace")) return { name: "Brightspace", icon: "brightspace-generic" };

    // 5. Fallback
    return { name: "Externe Link", icon: "globe" };
}