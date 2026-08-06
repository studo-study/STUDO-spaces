import type { ComponentType, SVGProps } from "react";
import { BookText, Layers, LayoutGrid, LayoutPanelTop } from "lucide-react";
import SvenIcon from "@/components/ui/overige/icons/SvenLogo";

export type TabIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

export interface CourseTab {
  key: string;
  slug: string;
  label: string;
  Icon: TabIcon;
}

// Eén bron van waarheid voor de course-tabs (sidebar + eventuele header).
export const COURSE_TABS: CourseTab[] = [
  { key: "overview", slug: "overview", label: "Overview", Icon: LayoutGrid },
  { key: "documents", slug: "documents", label: "Cursus", Icon: BookText },
  { key: "flow", slug: "flow", label: "Flow", Icon: LayoutPanelTop },
  { key: "sets", slug: "sets", label: "Sets", Icon: Layers },
  { key: "sven", slug: "sven", label: "Sven", Icon: SvenIcon },
];
