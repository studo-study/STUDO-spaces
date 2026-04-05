import {useTranslations} from "next-intl";
import {HiSparkles} from "react-icons/hi";
import {IoSparklesSharp} from "react-icons/io5";

interface ImportButtonProps {
    setShowImporter: (value: boolean) => void;
}
export default function ImportButton({setShowImporter}: ImportButtonProps) {
    const t = useTranslations("createstudoset")
    return (
        <div
            onClick={() => setShowImporter(true)}
            className="group flex items-center shadow-2xl border border-studoborder/30 justify-center w-fit h-12 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform"
            data-cy="import_button">

            <div className="relative flex items-center h-full justify-center p-[3px] bg-gray-700">

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 aiBorderAnimation" />

                <div className="relative z-10 px-10 h-10 rounded-full bg-gray-700 flex items-center justify-center gap-2 text-white font-bold">
                    <IoSparklesSharp />
                    {t("import")}
                </div>
            </div>
        </div>
    )
}