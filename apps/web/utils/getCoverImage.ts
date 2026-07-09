import CourseIcons from "@/data";

export function getCoverImage(title: string): string {
  const key = Object.keys(CourseIcons).find((k) =>
    title.toLowerCase().includes(k),
  ) as keyof typeof CourseIcons | undefined;
  return key
    ? `/icons/courses/${CourseIcons[key]}`
    : "/icons/courses/default.svg";
}
