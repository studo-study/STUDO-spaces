import { useEffect } from "react";
import {
  ICourseBreadCrumb,
  useCourseNavStore,
} from "@/store/course/courseNavStore";

// Zet de breadcrumb-nav voor de huidige course-pagina. Vervangt de per-pagina
// gedupliceerde setNav-useEffects.
export function useCourseNav(nav: ICourseBreadCrumb[]) {
  const setNav = useCourseNavStore((s) => s.setNav);
  const key = JSON.stringify(
    nav.map(({ title, href, isLast }) => ({ title, href, isLast })),
  );

  useEffect(() => {
    setNav(nav);
    // key dekt de serialiseerbare velden; icon-nodes worden bewust genegeerd.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNav, key]);
}
