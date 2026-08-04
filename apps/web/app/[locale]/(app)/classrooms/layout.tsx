import { ReactNode } from "react";
import ClassroomsHeader from "@/components/ui/app/private/classrooms/ClassroomsHeader";

export default function ClassroomsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <section className={"w-full flex flex-col  min-h-0 min-w-0 flex-1"}>
        <ClassroomsHeader />
        <div className={"flex min-h-0 min-w-0 flex-1"}>{children}</div>
      </section>
    </>
  );
}
