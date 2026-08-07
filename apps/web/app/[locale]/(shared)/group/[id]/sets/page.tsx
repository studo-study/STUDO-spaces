import RecentlyAdded from "@/components/ui/app/private/classroom/sets/RecentlyAdded";
import { mockFullClassrooms } from "@/data/mocks/classroomsMock";

export default function ClassroomSetsPage() {
  const items = mockFullClassrooms[0];
  return (
    <div className={"w-full h-full"}>
      <RecentlyAdded items={items} />
    </div>
  );
}
