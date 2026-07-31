import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { useTranslations } from "next-intl";

interface ReviewItem {
  word: string;
  correct: boolean;
}
interface InterMezzoScreenProps {
  items: ReviewItem[];
}
const InterMezzoScreen: React.FC<InterMezzoScreenProps> = ({ items }) => {
  const t = useTranslations("learn");
  return (
    <div
      className={
        "flex flex-col min-h-0 min-w-0 flex-1 items-center justify-center gap-6"
      }
    >
      <span className={"text-2xl font-semibold"}>Even terugblikken</span>
      <div className={"flex flex-col gap-3 w-2/3"}>
        {items.map((item, i) => (
          <AnimateOnMount key={i} delay={i * 50}>
            <div
              className={
                "flex flex-row items-center justify-between px-5 h-12 rounded-2xl bg-studogrey/30"
              }
            >
              <span className={"font-medium"}>{item.word}</span>
              <span
                className={item.correct ? "text-emerald-500" : "text-rose-500"}
              >
                {item.correct ? "✓" : "✗"}
              </span>
            </div>
          </AnimateOnMount>
        ))}
      </div>
      <span className={"text-sm dark:text-studogrey text-black/25"}>
        {t("enter_continue")}
      </span>
    </div>
  );
};

InterMezzoScreen.displayName = "InterMezzoScreen";
export default InterMezzoScreen;
