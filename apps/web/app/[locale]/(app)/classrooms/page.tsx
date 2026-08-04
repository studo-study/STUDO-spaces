import { Metadata } from "next";
import Grid from "@/components/ui/app/private/classrooms/ClassroomsGrid";

export const metadata: Metadata = {
  title: "Classrooms | Studo",
};

export default function ClassroomsPage() {
  return (
    <div className="min-h-0 min-w-0 flex-1">
      <Grid />
    </div>
  );
}
