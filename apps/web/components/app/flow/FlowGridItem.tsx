import {FlowBoardOverview} from "@studo/types";
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/design_system/icons/iconRegistry";
import {useTranslations} from "next-intl";
import {auth} from "@/auth";
import Image from "next/image";
import {getTranslations} from "next-intl/server";

interface FlowGridItemProps {
    item: FlowBoardOverview;
}
export default async function FlowGridItem(props:FlowGridItemProps ) {
    const {item} = props;
    const t = await getTranslations('flow')
    const Icon = getFlowIcon(item.icon);
    const session = await auth();
    const id = session?.user?.id
    console.log(id);
    return(<Link href={"/flow/" + item.id}>
        <div className={"relative w-full flex flex-col hover:border-studoborder transition-all h-50 p-5 rounded-3xl text-studodarkblue dark:text-white border border-studoborder/30 bg-studogrey/30"}>
            <div className={"flex h-fit flex-row gap-5 items-center"}>
                <div className={'w-13 h-13 rounded-xl bg-emerald-400/30 text-emerald-500 flex items-center justify-center'}>
                    <Icon size={25} />
                </div>
                <div className={"flex flex-col gap-1"}>
                    <span className={"font-bold text-xl"}>{item.title}</span>
                    <span className={"text-xs text-studodarkblue/40 dark:text-white/40"}>{item.year} {item.semester && "• " + item.semester}</span>
                </div>
            </div>
            <div>
            </div>
            <div className={'w-full h-full text-sm flex flex-row justify-between items-end'}>
                <div className={"w-full flex flex-row items-center justify-between"}>
                    <div className={'flex flex-row items-center gap-2'}>
                        <div className={'w-8 h-8 rounded-full overflow-hidden border border-studoborder'}>
                            <Image alt={'pfp'} width={0} height={0} src={item.owner_pfp} className="h-8 w-8 contain"/>
                        </div>
                        <Link href={item.owner_id === id ? ('/account') : ("/profile/" + item.owner_id)}>
                            <span>{item.owner_name} </span>
                            <span className={'text-zinc-300 text-xs dark:text-white/30'}>{item.owner_id === id && t('you')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    </Link>)
}

