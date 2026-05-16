import { useTranslations } from "next-intl";
import Phrases from "@/data/phrases";

export default function StreakPage() {
  const t = useTranslations("streak");
  const Streak = 32;
  return (
    <div className="w-full h-full py-15 bg-radial from-orange-300/10 via-transparent to-transparent flex flex-col justify-center items-center gap-10 scroll-hidden">
      <div className="w-full h-full overflow-hidden flex flex-col gap-10 justify-center items-center">
        <div className=" h-40 border-none flex justify-center items-center">
          <video
            autoPlay
            loop
            muted
            className="block w-90 h-90 mix-blend-multiply backface-visibility-hidden border-none outline-none"
          >
            <source src={"/animations/Streak.webm"} />
          </video>
        </div>
        <span
          className="font-atrament bg-gradient-to-b from-orange-400
				to-yellow-400 bg-clip-text font-bold text-transparent text-9xl"
        >
          {Streak}
        </span>

        <span className="font-atrament font-sfpro font-bold text-3xl text-orange-400">
          {t("d_s")}
        </span>
        <span className="font-sfpro text-xl text-gray-400">
          {t("phrase_1")}
          {Streak}
          {t("phrase_2")}.
        </span>
        <span className="font-sfpro text-xl text-gray-400">{Phrases()}!</span>
      </div>
    </div>
  );
}
