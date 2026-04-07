import {useTranslations} from "next-intl";
import CurrentPlan from "@/components/app/settings/current_plan/CurrentPlan";
import Accessibility from "@/components/app/settings/accessibility/Accessibility";
import PersonalInfo from "@/components/app/settings/personal_info/PersonalInfo";
import AccountPrivacy from "@/components/app/settings/account_privacy/AccountPrivacy";
import {Metadata} from "next";
import LearnSettings from "@/components/app/settings/learn_modes/LearnSettings";
import ClassroomSettings from "@/components/app/settings/classroom_settings/ClassroomSettings";
import Notifications from "@/components/app/settings/notifications/Notifications";
import {Shortcuts} from "@/components/app/settings/shortcuts/Shortcuts"
export const metadata:Metadata = {
    title:"Settings | Studo"
}


export default function SettingsPage() {
    const t = useTranslations("settings")
    return(
        <div className="w-full min-h-0 h-fit py-15 flex flex-col dark:text-white text-studodarkblue gap-15 scroll-hidden">
            <span className={"w-full h-10 font-bold text-3xl"}>{t("title")}:</span>
            <PersonalInfo />
            <Shortcuts/>
            <CurrentPlan />
            <Accessibility />
            <Notifications/>
            <LearnSettings />
            <ClassroomSettings/>
            <AccountPrivacy />

        </div>
    )
}