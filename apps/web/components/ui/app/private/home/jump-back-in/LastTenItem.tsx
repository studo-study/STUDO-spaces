import Container from "@studo/ui/design_system/container/Container";
import { LastStudied } from "@studo/types";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/app/shared/studosets/progress/progress";
import Link from "next/link";
import { ArrowRight, GalleryVerticalEnd, Images } from "lucide-react";

interface LastTenItemProps {
  data: LastStudied;
}

const LastTenItem = (props: LastTenItemProps) => {
  const { data } = props;
  const t = useTranslations("home");
  return (
    <Container className="min-w-150 w-150 px-10 justify-center hover:border-neutral-400 transition-all duration-300">
      <div className="absolute -z-10 w-full h-full bg-linear-0 from-blue-400/5 to-transparent  left-0" />
      <div className={"w-full flex flex-row gap-5"}>
        <div className={"p-5 w-2/3 flex flex-col gap-2"}>
          <div className={"flex flex-row gap-2 items-center "}>
            {data.type === "studyset" ? (
              <GalleryVerticalEnd size={20} />
            ) : (
              <Images size={20} />
            )}
            <span
              className={
                "text-xl font-bold dark:text-white truncate overflow-hidden text-studodarkblue"
              }
            >
              {data.title}
            </span>
          </div>
          <div
            className={
              "flex flex-row gap-2 pb-4 text-xs dark:text-white opacity-50"
            }
          >
            <span>
              {t("last_studied")} -{" "}
              {new Date(data.lastStudied).toLocaleDateString()}
            </span>
          </div>
          <Link
            href={
              data.type === "studyset"
                ? "/studoset/" + data.setId
                : "/visualset/" + data.setId
            }
          >
            <BaseButton
              label={t("continue")}
              bg={"bg-studoblue"}
              iconRight={<ArrowRight size={13} />}
            />
          </Link>
        </div>
        <div
          className={"w-1/3 flex flex-col gap-2 items-center justify-center"}
        >
          <Progress
            height={80}
            length={data.length || 1}
            progress={data.progress}
          />
        </div>
      </div>
    </Container>
  );
};

LastTenItem.displayName = "LastTenItem";
export default LastTenItem;
