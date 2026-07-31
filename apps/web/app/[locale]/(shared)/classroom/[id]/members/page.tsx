import ClassroomUserGrid from "@/components/ui/app/private/classroom/users/ClassroomUserGrid";
import { mockClassroomUsers } from "@/data/mocks/classroomsMock";

const Users = mockClassroomUsers;

const MockRequests = [
  {
    displayName: "Charles Degraeuwe",
    date: new Date().toISOString(),
    imgUrl: "https://example.com",
    id: "user19293",
  },
];

export default function ClassroomMembersPage() {
  return (
    <div className={"w-full h-full"}>
      <ClassroomUserGrid users={Users} requests={MockRequests} />
    </div>
  );
}
