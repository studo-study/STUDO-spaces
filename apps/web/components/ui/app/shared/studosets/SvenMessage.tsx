import { ReactNode } from "react";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import SvenIcon from "@/components/ui/overige/icons/SvenLogo";
import { ComposerAura } from "@/components/ui/design_system/composer_aura/ComposerAura";

interface SvenMessageProps {
  description?: string;
  cta?: ReactNode;
}
const SvenMessage: React.FC<SvenMessageProps> = (props) => {
  const { description } = props;
  return (
    <div className={"my-5 group"}>
      <ComposerAura>
        <div
          className={
            "border border-studoborder/30 h-fit hover:border-studoborder duration-300 transition-colors shadow-xl rounded-full bg-studogrey/10 p-3 flex flex-row gap-3"
          }
        >
          <div
            className={
              "h-12 w-12 min-w-12 min-h-12 flex items-center justify-center shadow-sm rounded-full bg-studogrey/10"
            }
          >
            <SvenIcon size={20} />
          </div>
          <div className={"flex flex-row w-full min-h-0 flex-1 items-center"}>
            <p className={"flex-1 min-w-0"}>{description}</p>
            <BaseButton size="sm">check out</BaseButton>
          </div>
        </div>
      </ComposerAura>
    </div>
  );
};

SvenMessage.displayName = "SvenMessage";
export default SvenMessage;
