import RecentlyAdded from "@/components/ui/app/classroom/sets/RecentlyAdded";
import {mockFullClassrooms} from "@/data/mocks/classroomsMock";
import SetSearch from "@/components/ui/app/your-files/sets/search";

export default function ClassroomSetsPage() {
    const items = mockFullClassrooms[0];
    return (<div className={"w-full h-full"}>
        <RecentlyAdded items={items}/>
    </div>)
}