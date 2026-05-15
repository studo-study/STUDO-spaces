import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { PiBooks } from "react-icons/pi";
import CourseItem from "@/components/ui/app/your-files/courses/courseItem";

interface CoursesProps {
  items: string[];
}
const CourseContainer = (props: CoursesProps) => {
  const { items } = props;

  const t = useTranslations("home");
  return (
    <section className="flex flex-col gap-5 overflow-visible">
      <SectionHeader
        sectionIcon={<PiBooks />}
        title={t("courses_overview_title")}
        linkText={t("all_courses")}
        href={"/your-files/courses"}
      />
      <Container height={"30"}>
        <div className="min-w-full w-full flex flex-row gap-5">
          {items.map((item, index) => (
            <CourseItem course={item} key={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

CourseContainer.displayName = "CourseContainer";
export default CourseContainer;
