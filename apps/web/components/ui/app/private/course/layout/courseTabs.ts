import {
  BookText,
  Layers,
  LayoutGrid,
  SquareCheck,
  type LucideIcon,
} from "lucide-react";

export interface CourseTab {
  // key komt overeen met het route-segment (usePathname segment 3)
  key: string;
  // pad-segment dat achter /course/:id komt
  slug: string;
  label: string;
  Icon: LucideIcon;
}

// Eén bron van waarheid voor de course-tabs (sidebar + eventuele header).
export const COURSE_TABS: CourseTab[] = [
  { key: "overview", slug: "overview", label: "Overview", Icon: LayoutGrid },
  { key: "flow", slug: "flow", label: "Flow", Icon: SquareCheck },
  { key: "documents", slug: "documents", label: "Cursus", Icon: BookText },
  { key: "sets", slug: "sets", label: "Sets", Icon: Layers },
];
