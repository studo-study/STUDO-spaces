"use client";
import { useCourseNavStore } from "@/store/course/CourseNavStore";
import { ChevronRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

// roots waarvan het volgende segment een set-id is → resolven naar de titel
const SET_ROOTS = new Set([
  "studoset",
  "visualset",
  "learn",
  "flashcards",
  "speedy",
]);

// NL-labels per route-segment voor de path-afgeleide breadcrumb (app-pagina's
// die zelf geen crumbs in de store zetten).
const NL_LABELS: Record<string, string> = {
  home: "Home",
  account: "Account",
  settings: "Instellingen",
  classrooms: "Klassen",
  library: "Bibliotheek",
  courses: "Vakken",
  course: "Vak",
  documents: "Documenten",
  overview: "Overzicht",
  flow: "Flow",
  sets: "Sets",
  studoset: "Set",
  visualset: "Visualset",
  learn: "Leren",
  flashcards: "Flashcards",
  speedy: "Speedy",
  edit: "Bewerken",
  streak: "Streak",
  select: "Studo Select",
  pay: "Betalen",
  sven: "Sven",
  admin: "Admin",
  invite: "Uitnodigen",
  reports: "Meldingen",
  search: "Zoeken",
  stats: "Statistieken",
  users: "Gebruikers",
  "create-studoset": "Studoset maken",
  "create-visualset": "Visualset maken",
  "search-result": "Zoekresultaten",
};

const labelFor = (seg: string) =>
  NL_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);

interface Crumb {
  label: ReactNode;
  href: string;
  isLast: boolean;
  icon?: ReactNode;
}

const BreadCrumbs = () => {
  const t = useTranslations("breadcrumbs");
  const nav = useCourseNavStore((state) => state.nav);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // 1) course-pagina's zetten rijke crumbs (incl. document-titels) in de store.
  //    Enkel gebruiken op een echte course-route — de store wordt niet gewist,
  //    dus buiten /course/ zijn die crumbs stale (bv. in flashcard-mode).
  // 2) andere app-pagina's → crumbs afleiden uit het pad met NL-labels
  const onCourseRoute = pathname.startsWith("/course/");
  let crumbs: Crumb[];
  if (onCourseRoute && nav.length > 0) {
    crumbs = nav.map((link) => ({
      label: link.translate ? t(link.title.toLowerCase()) : link.title,
      href: link.href,
      isLast: link.isLast,
      icon: link.icon,
    }));
  } else {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    const derived: Crumb[] = [];

    if (SET_ROOTS.has(segments[0]) && segments[1]) {
      // set/mode-pagina → Home, dan de set-naam, dan eventueel de mode
      const root = segments[0];
      const id = segments[1];
      const title =
        queryClient.getQueryData<{ title?: string }>(["studosets", id])
          ?.title ?? labelFor("studoset");
      derived.push({ label: labelFor("home"), href: "/home", isLast: false });
      derived.push({ label: title, href: `/studoset/${id}`, isLast: false });
      // modes (learn/flashcards/speedy) krijgen een tweede crumb; de
      // overview-roots (studoset/visualset) blijven één crumb breed
      if (root !== "studoset" && root !== "visualset") {
        derived.push({
          label: labelFor(root),
          href: `/${root}/${id}`,
          isLast: false,
        });
      }
      // extra segmenten (edit, pin, point, ...)
      let acc = `/${root}/${id}`;
      segments.slice(2).forEach((seg) => {
        acc += "/" + seg;
        derived.push({ label: labelFor(seg), href: acc, isLast: false });
      });
    } else {
      // generieke app-pagina → Home vooraan tenzij we al op home zitten
      if (segments[0] !== "home") {
        derived.push({ label: labelFor("home"), href: "/home", isLast: false });
      }
      let acc = "";
      segments.forEach((seg) => {
        acc += "/" + seg;
        derived.push({ label: labelFor(seg), href: acc, isLast: false });
      });
    }

    if (derived.length > 0) derived[derived.length - 1].isLast = true;
    crumbs = derived;
  }

  if (crumbs.length === 0) return null;

  return (
    <div
      className={
        "py-1 w-fit px-2 gap-1 text-sm dark:text-white text-studodarkblue flex flex-row"
      }
    >
      {crumbs.map((crumb) => (
        <div className={"flex flex-row gap-1 items-center"} key={crumb.href}>
          <Link
            href={crumb.href}
            className={
              "gap-1 flex flex-row items-center font-semibold py-1.5 rounded-3xl px-3 hover:bg-studogrey/30"
            }
          >
            {crumb.icon} {crumb.label}
          </Link>
          {!crumb.isLast && <ChevronRight size={15} className={"opacity-50"} />}
        </div>
      ))}
    </div>
  );
};

BreadCrumbs.displayName = "BreadCrumbs";
export default BreadCrumbs;
