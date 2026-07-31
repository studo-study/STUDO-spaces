import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarClock,
  Files,
  Layers,
  NotebookText,
} from "lucide-react";
import ProgressWidget from "@/components/ui/app/private/course/overview/widgets/ProgressWidget";
import UrgentWidget from "@/components/ui/app/private/course/overview/widgets/UrgentWidget";
import SetsWidget from "@/components/ui/app/private/course/overview/widgets/SetsWidget";
import FilesWidget from "@/components/ui/app/private/course/overview/widgets/FilesWidget";
import NotesWidget from "@/components/ui/app/private/course/overview/widgets/NotesWidget";

/** Number of columns in the widget grid. Shared by layout + placement logic. */
export const GRID_COLS = 3;

export type WidgetType = "progress" | "urgent" | "sets" | "files" | "notes";

export interface WidgetDef {
  type: WidgetType;
  /** i18n key under `flow.widgets.<label>` */
  label: string;
  icon: ReactNode;
  /** Default size in grid units (grid has 12 cols). */
  defaultW: number;
  defaultH: number;
  /** Minimum size in grid units, enforced on resize. */
  minW: number;
  minH: number;
  /** Content rendered inside a WidgetItem. Kept simple for now — swap in
   *  the real data-bound components as they get wired up. */
  render: () => ReactNode;
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDef> = {
  progress: {
    type: "progress",
    label: "progress",
    icon: <BarChart3 size={16} />,
    defaultW: 2,
    defaultH: 1,
    minW: 2,
    minH: 1,
    render: () => (
      <ProgressWidget icon={<BarChart3 size={18} />} type={"progress"} />
    ),
  },
  urgent: {
    type: "urgent",
    label: "urgent",
    icon: <CalendarClock size={16} />,
    defaultW: 1,
    defaultH: 1,
    minW: 1,
    minH: 1,
    render: () => (
      <UrgentWidget icon={<CalendarClock size={18} />} type={"urgent"} />
    ),
  },
  sets: {
    type: "sets",
    label: "sets",
    icon: <Layers size={16} />,
    defaultW: 1,
    defaultH: 1,
    minW: 1,
    minH: 1,
    render: () => <SetsWidget icon={<Layers size={18} />} type={"sets"} />,
  },
  files: {
    type: "files",
    label: "files",
    icon: <Files size={16} />,
    defaultW: 2,
    defaultH: 1,
    minW: 1,
    minH: 1,
    render: () => <FilesWidget icon={<Files size={18} />} type={"files"} />,
  },
  notes: {
    type: "notes",
    label: "notes",
    icon: <NotebookText size={16} />,
    defaultW: 1,
    defaultH: 1,
    minW: 1,
    minH: 1,
    render: () => (
      <NotesWidget icon={<NotebookText size={18} />} type={"notes"} />
    ),
  },
};

export const WIDGET_TYPES = Object.keys(WIDGET_REGISTRY) as WidgetType[];
