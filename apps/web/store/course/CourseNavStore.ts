import { create } from "zustand";
import { ReactNode } from "react";

export interface ICourseBreadCrumb {
  icon?: ReactNode;
  title: string;
  href: string;
  isLast: boolean;
  translate?: boolean;
}

interface CourseNavStore {
  nav: ICourseBreadCrumb[];
  setNav: (input: ICourseBreadCrumb[]) => void;
  document: string;
  setDocument: (input: string) => void;
}

// Breadcrumb-navigatie voor de course-layout. LayoutHeader/BreadCrumbs leest
// `nav`; elke course-pagina zet z'n crumbs via de useCourseNav-hook.
export const useCourseNavStore = create<CourseNavStore>((set) => ({
  nav: [],
  setNav: (input) => set({ nav: input }),
  document: "",
  setDocument: (input) => set({ document: input }),
}));
