import Members from "@/components/app/classroom/overview/Members";
import RecentlyAdded from "@/components/app/classroom/overview/RecentlyAdded";
import {useTranslations} from "next-intl";
import {mockFullClassrooms} from "@/data/mocks/classroomsMock";
const items = mockFullClassrooms[0]
export default function ClassroomOverviewPage() {
    return (
        <div className="w-full h-full flex flex-row gap-5 py-10 overflow-y-auto">
            <RecentlyAdded items={items}/>
            <Members/>
        </div>)
}