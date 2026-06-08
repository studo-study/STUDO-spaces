"use client";
import { FlowBoardOverview } from "@studo/types";
import { Link } from "@/i18n/routing";
import { getFlowIcon } from "@/components/ui/design_system/icons/iconRegistry";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers/auth/UserProvider";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/store/slices/flow/flowStore";
import Avatar from "@/components/ui/design_system/avatar/Avatar";

interface FlowGridItemProps {
  item: FlowBoardOverview;
}
export default function FlowGridItem(props: FlowGridItemProps) {
  const { item } = props;
  const t = useTranslations("flow");
  const { Icon, color } = getFlowIcon(item.icon);
  const user = useUser().user;
  const id = user?.id;
  const name = user?.displayName;
  const router = useRouter();
  const { removeBoard } = useFlowStore();
  //methods
  const handleDelete = () => {
    removeBoard(item.id);
  };
  console.log(id);
  return (
    <div
      onClick={() => router.push(`/flow/${item.id}/overview`)}
      className={
        "relative w-full flex flex-col cursor-pointer transition-all h-50 p-5 rounded-3xl text-studodarkblue dark:text-white studo-surface hover:brightness-110"
      }
    >
      <div className={"flex h-fit flex-row gap-5 items-center"}>
        <div
          className={`bg-${color}-400/20 text-${color}-500 w-10 h-10 rounded-2xl flex items-center justify-center`}
        >
          <Icon size={20} />
        </div>
        <div className={"flex flex-col gap-1"}>
          <span
            className={"font-bold text-lg overflow-hidden truncate max-w-7/8"}
          >
            {item.title}
          </span>
          <span className={"text-xs text-studodarkblue/40 dark:text-white/40"}>
            {item.year}{" "}
            {item.semester && "• " + t("semester") + " " + item.semester}
          </span>
        </div>
        <div className={"absolute top-5 right-5"}>
          <ItemOptions
            options={[
              {
                label: t("delete"),
                icon: <FiTrash2 size={14} />,
                onClick: () => handleDelete(),
                danger: true,
              },
            ]}
          />
        </div>
      </div>
      <div></div>
      <div
        className={
          "w-full h-full text-sm flex flex-row justify-between items-end"
        }
      >
        <div className={"w-full flex flex-row items-center justify-between"}>
          <div className={"flex flex-row items-center gap-2"}>
            <div
              className={
                "w-8 h-8 rounded-full overflow-hidden border border-studoborder"
              }
            >
              <Avatar displayName={name!} id={id!} />
            </div>
            <Link
              href={
                item.owner_id === id ? "/account" : "/profile/" + item.owner_id
              }
            >
              <span>{item.owner_name} </span>
              <span className={"text-zinc-300 text-xs dark:text-white/30"}>
                {item.owner_id === id && t("you")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
