import { useState } from "react";
import useSWR from "swr";
import CourseItem from "./CourseItem.jsx";
import { Outlet } from "react-router-dom";

export default function CoursesPage() {
  const [select, setSelect] = useState(true);
  const { data: data, isLoading } = useSWR("users/me/studosets");

  const courses = new Set();

  if (!isLoading && data) {
    data.studysets?.forEach((set) => {
      courses.add(set.course);
    });

    data.visualsets?.forEach((set) => {
      courses.add(set.course);
    });
  }

  const coursesArray = Array.from(courses);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-fit flex flex-row items-center justify-between gap-2 sm:gap-3 py-3">
      </div>

      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {!isLoading && coursesArray.map((course, index) => (
          <CourseItem course={course} key={index} />
        ))}
      </div>
      <Outlet />
    </div>
  );
}