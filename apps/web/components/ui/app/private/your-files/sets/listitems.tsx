import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { StudySetItem } from "@/components/ui/app/private/your-files/sets/grid";
import FlowIcon from "@/components/ui/app/private/course/other/FlowIcon";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { FiTrash2 } from "react-icons/fi";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { useDeleteStudoset } from "@/hooks/app/sets/useDeleteStudoset";
import { getCoverImage } from "@/utils/getCoverImage";
import { useRouter } from "@/i18n/routing";

interface ListItemProps {
  items: StudySetItem[];
}

export default function ListItems({ items }: ListItemProps) {
  const t = useTranslations("y_f.your_sets");
  const locale = useLocale();
  return (
    <div className="flex-1 scroll-hidden h-full mb-10 z-10 flex flex-col gap-5 pb-15">
      {items.map((item, index) => (
        <ListItem
          set={item}
          key={item.id}
          index={index}
          t={t}
          locale={locale}
        />
      ))}
    </div>
  );
}

interface SetItemProps {
  set: StudySetItem;
  t: ReturnType<typeof useTranslations>;
  locale: string;
  index: number;
}

function ListItem({ set, t, locale }: SetItemProps) {
  const date = new Date(set.lastUpdated)
    .toLocaleDateString(locale)
    .split("-")
    .join("/");
  const iconSrc =
    set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
  const link =
    set.type === "studyset" ? `/studoset/${set.id}` : `/visualset/${set.id}`;
  const { mutate: deleteSet } = useDeleteStudoset();
  const router = useRouter();
  const handleDelete = () => deleteSet(set.id);
  return (
    <Link
      href={link}
      className="max-h-22 h-22 flex-col sm:flex-row px-10 pl-2.5 py-3 sm:py-0 max-w-full min-w-full cursor-pointer
                flex gap-3 items-center w-full rounded-3xl bg-studogrey/30 border border-studoborder/30 hover:border-studoborder transition-all duration-300"
    >
      <div className="flex flex-row gap-3 items-center w-full sm:w-1/2 sm:flex-1">
        <div className="w-17 h-17 rounded-2xl dark:bg-studogrey/30 bg-white flex items-center justify-center">
          {set.flowcourseIcon ? (
            <FlowIcon
              icon={set.flowcourseIcon}
              size={22}
              className="w-10 h-10 rounded-lg"
            />
          ) : (
            <Image
              width={32}
              height={32}
              className="w-8"
              src={getCoverImage(set.title)}
              alt={set.title}
            />
          )}
        </div>

        <div className={"w-fit flex flex-col gap-1"}>
          <div className={"w-fit flex flex-row gap-2 items-center"}>
            <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
              {set.title}
            </span>
          </div>
          <div
            className={
              "w-full flex flex-row gap-2 items-center opacity-50 dark:text-white text-xs"
            }
          >
            <Image
              src={iconSrc}
              alt={"type"}
              height={15}
              width={15}
              className={"dark:invert dark:brightness-0 h-4"}
            />
            <span>{set.lastUpdated && date}</span>
          </div>
        </div>
      </div>

      <div className="min-w-60 w-full sm:w-auto flex flex-row items-center justify-end sm:gap-6">
        <Avatar id={set.userId} displayName={set.displayName} />
        <div>
          <ItemOptions
            options={[
              {
                label: t("edit_set"),
                icon: <MdEditNote />,
                onClick: () => {
                  router.push("/studoset/" + set.id + "/edit");
                },
              },
              {
                label: t("external_window"),
                icon: <FaExternalLinkAlt size={10} />,
                onClick: () => {
                  window.open(
                    `/studoset/${set.id}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                },
              },
              {
                label: t("delete"),
                icon: <FiTrash2 size={14} />,
                onClick: (ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  handleDelete();
                },
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </Link>
  );
}
