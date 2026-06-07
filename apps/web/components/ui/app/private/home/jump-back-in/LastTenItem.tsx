import Container from "@/components/ui/design_system/container/Container";
import { LastStudied } from "@studo/types";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useTranslations } from "next-intl";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { Progress } from "@/components/ui/app/public/marketing/progress/progress";
import Link from "next/link";

interface LastTenItemProps {
  data: LastStudied;
}

const LastTenItem = (props: LastTenItemProps) => {
  const { data } = props;
  const t = useTranslations("home");
  return (
    <Container className="min-w-110 w-110 px-10 justify-center hover:border-studoborder transition-all duration-300">
      <div className="absolute -z-10 w-full h-full bg-linear-0 from-blue-400/5 to-transparent  left-0" />
      <div className={"w-full flex flex-row gap-5"}>
        <div className={"p-5 w-2/3 flex flex-col gap-2"}>
          <div className={"flex flex-row gap-2 "}>
            <Image
              alt="settype"
              src={
                data.type === "studyset"
                  ? "/icons/studyset.svg"
                  : "/icons/visualset.svg"
              }
              width={5}
              height={5}
              className={"w-5 dark:invert dark:brightness-0"}
            />
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
              {new Date(data.last_studied).toLocaleDateString()}
            </span>
          </div>
          <Link
            href={
              data.type === "studyset"
                ? "/studoset/" + data.set_id
                : "/visualset/" + data.set_id
            }
          >
            <BaseButton
              label={t("continue")}
              bg={"bg-studoblue"}
              iconRight={<FaArrowRight />}
            />
          </Link>
        </div>
        <div
          className={"w-1/3 flex flex-col gap-2 items-center justify-center"}
        >
          <Progress height={80} length={10} progress={0} />
        </div>
      </div>
    </Container>
  );
};

LastTenItem.displayName = "LastTenItem";
export default LastTenItem;
