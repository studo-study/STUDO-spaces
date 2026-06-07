import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import SvenImport from "@/components/ui/app/private/create-studoset/svenimport";
import Textimport from "@/components/ui/app/private/create-studoset/textimport";
import { CardData } from "@/types/types";
import { TabSwitcher } from "@/components/ui/design_system/tabswitcher/TabSwitcher";
import { RiAiGenerate } from "react-icons/ri";
import { LuScanText } from "react-icons/lu";
interface importerProps {
  onClose: () => void;
  cardArray: CardData[];
  setCardArray: React.Dispatch<React.SetStateAction<CardData[]>>;
}

type Tab = "sven" | "text";

export default function SetImporter({
  onClose,
  cardArray,
  setCardArray,
}: importerProps) {
  const t = useTranslations("import");
  const [tab, setTab] = useState<Tab>("sven");

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col justify-between items-center z-[9999]
      bg-blue-50 dark:bg-bg-dark px-4 sm:px-6 md:px-10 py-4 sm:py-5"
    >
      <div
        className={
          "relative w-full h-14 flex flex-row justify-center items-center "
        }
      >
        <div className="absolute right-0  ">
          <IoClose
            size={28}
            onClick={onClose}
            className="cursor-pointer text-gray-700 dark:text-white hover:text-gray-500 sm:w-[35px] sm:h-[35px]"
          />
        </div>
        <div>
          <TabSwitcher
            tabs={[
              {
                key: "sven",
                label: t("sven"),
                icon: <RiAiGenerate />,
              },
              {
                key: "text",
                label: t("text"),
                icon: <LuScanText />,
              },
            ]}
            value={tab}
            onChange={(key) => {
              setTab(key as Tab);
            }}
          />
        </div>
      </div>
      <div className="min-w-full relative flex overflow-hidden h-full mt-5">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
            tab === "sven" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SvenImport
            onClose={onClose}
            cardArray={cardArray}
            setCardArray={setCardArray}
          />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
            tab === "sven" ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="h-full w-2/3">
            <Textimport
              onClose={onClose}
              cardArray={cardArray}
              setCardArray={setCardArray}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
