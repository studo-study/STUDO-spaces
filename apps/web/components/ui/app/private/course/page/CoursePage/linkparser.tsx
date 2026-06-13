import universityData from "@/components/ui/app/private/course/page/CoursePage/KnownLinks";

export function Linkparser(link: string) {
  if (!link) return { name: "Onbekend", icon: "default-link" };

  const lowerLink = link.toLowerCase();

  for (const instelling of universityData) {
    if (instelling.patterns.some((pattern) => lowerLink.includes(pattern))) {
      return {
        name: instelling.name,
        icon: instelling.icon,
      };
    }
  }

  if (lowerLink.includes("instructure.com"))
    return { name: "Canvas", icon: "canvas-generic" };
  if (lowerLink.includes("moodle"))
    return { name: "Moodle", icon: "moodle-generic" };
  if (lowerLink.includes("brightspace"))
    return { name: "Brightspace", icon: "brightspace-generic" };

  // 5. Fallback
  return { name: "Externe Link", icon: "globe.png" };
}
