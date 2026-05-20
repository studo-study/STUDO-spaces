import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import SvenImport from "@/components/ui/app/create-studoset/svenimport";
import ExcelImport from "@/components/ui/app/create-studoset/excelimport";
import { CardData } from "@/types/types";
import { TabSwitcher } from "@/components/ui/design_system/tabswitcher/TabSwitcher";
import { RiAiGenerate } from "react-icons/ri";
interface importerProps {
  onClose: () => void;
  cardArray: CardData[];
  setCardArray: React.Dispatch<React.SetStateAction<CardData[]>>;
}

type Tab = "sven" | "excel";

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
        <TabSwitcher
          tabs={[
            {
              key: "sven",
              label: t("sven"),
              icon: <RiAiGenerate />,
            },
          ]}
          value={tab}
          onChange={(key) => {
            setTab(key as Tab);
          }}
        />
      </div>
      <div className={"w-3/4 h-full"}>
        {tab === "sven" ? (
          <SvenImport
            onClose={onClose}
            cardArray={cardArray}
            setCardArray={setCardArray}
          />
        ) : (
          <ExcelImport />
        )}
      </div>
    </div>
  );
}
