import { Metadata } from "next";
import Grid from "@/components/ui/app/classrooms/ClassroomsGrid";

export const metadata: Metadata = {
  title: "Classrooms | Studo",
};

export default function ClassroomsPage() {
  return (
    <div className="w-full h-full">
      <Grid />
    </div>
  );
}
