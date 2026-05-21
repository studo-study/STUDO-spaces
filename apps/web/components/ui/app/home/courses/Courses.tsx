"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { PiBooks } from "react-icons/pi";
import CourseItem from "@/components/ui/app/your-files/courses/courseItem";
import { useCourses } from "@/hooks/app/courses/useCourses";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";

const Courses = () => {
  const { courses } = useCourses();
  const t = useTranslations("home");

  if (courses.length === 0) return null;

  return (
    <AnimateOnMount delay={200}>
      <section className="flex flex-col gap-5 overflow-visible">
        <SectionHeader
          sectionIcon={<PiBooks />}
          title={t("courses_overview_title")}
          linkText={t("all_courses")}
          href={"/your-files/courses"}
        />
        <Container height={"30"}>
          <div className="min-w-full w-full flex flex-row gap-5">
            {courses.map((item, index) => (
              <CourseItem course={item} key={index} />
            ))}
          </div>
        </Container>
      </section>
    </AnimateOnMount>
  );
};

Courses.displayName = "Courses";
export default Courses;
