import {useTranslations} from "next-intl";
import {IoClose, IoSparklesSharp} from "react-icons/io5";
import {useState} from "react";
import SvenImport from "@/components/app/create-studoset/svenimport";
import ExcelImport from "@/components/app/create-studoset/excelimport";
import {CardData} from "@/types/types";
interface importerProps {
    onClose: () => void,
    cardArray: CardData[];
    setCardArray: React.Dispatch<React.SetStateAction<CardData[]>>;
}

export default function SetImporter({ onClose, cardArray, setCardArray }: importerProps) {
    const t = useTranslations("import")
    const [sven, setSven] = useState<boolean>(true)
    const toggleSven = () => {
        setSven(!sven)
    }
    return (
        <div className="fixed inset-0 w-full h-full flex flex-col justify-between items-center z-[9999]
      bg-blue-50 dark:bg-bg-dark px-4 sm:px-6 md:px-10 py-4 sm:py-5">
            <div className={"relative w-full h-14 flex flex-row justify-center items-center "}>
                <div className="absolute right-0  ">
                    <IoClose
                        size={28}
                        onClick={onClose}
                        className="cursor-pointer text-gray-700 dark:text-white hover:text-gray-500 sm:w-[35px] sm:h-[35px]"
                    />
                </div>
                <div className={'w-1/4 rounded-full h-14 border border-studoborder/30 bg-studogrey/30 shadow-2xl text-studodarkblue dark:text-white flex items-center justify-center gap-2 p-2 px-2'}>
                    <span onClick={toggleSven} className={`w-1/2 cursor-pointer rounded-full bg-gray-700 font-bold border border-gray-700 hover:border-studoborder transition-all duration-300  ${!sven && 'border-studoborder'}  shadow-2xl h-full flex items-center justify-center`}>{t('excel')}</span>
                    <div onClick={toggleSven} className="w-1/2 relative group rounded-full cursor-pointer bg-gray-700  flex items-center h-full justify-center p-[1px] ">

                        <div className={`absolute inset-0 w-full opacity-0 h-full group-hover:opacity-100 ${sven && 'opacity-100'} transition-opacity duration-300 aiBorderAnimation rounded-full`} />

                        <div className="relative z-10 px-5 w-full h-full rounded-full  bg-gray-700 flex items-center justify-center gap-2 text-white font-bold">
                            <IoSparklesSharp />
                            <span className={'truncate font-black'}>{t("sven")}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'w-full h-full'}>
                {sven ? <SvenImport onClose={onClose} cardArray={cardArray} setCardArray={setCardArray}/> : <ExcelImport/>}
            </div>
        </div>)
}