import { create } from "zustand";
import { ReactNode } from "react";

interface ICourseBreadCrumb {
  icon?: ReactNode;
  title: string;
  href: string;
  isLast: boolean;
}
interface CourseStore {
  nav: ICourseBreadCrumb[];
  setNav: (input: ICourseBreadCrumb[]) => void;
}
export const useCourseStore = create<CourseStore>((set) => ({
  nav: [],
  setNav: (input: ICourseBreadCrumb[]) => set({ nav: input }),
}));
