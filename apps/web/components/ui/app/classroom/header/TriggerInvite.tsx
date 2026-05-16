import { useTranslations } from "next-intl";
import { IoPersonAdd } from "react-icons/io5";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

interface TriggerClassroomProps {
  togglePopUp: () => void;
}

export default function TriggerInvite({ togglePopUp }: TriggerClassroomProps) {
  const t = useTranslations("classroom");

  return (
    <BaseButton
      iconLeft={<IoPersonAdd />}
      label={t("invite")}
      onClick={togglePopUp}
      bg={"bg-studogrey/30"}
    />
  );
}
