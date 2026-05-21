import { Link } from "@/i18n/routing";

import type { ComponentProps } from "react";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

interface LinkButtonProps extends ComponentProps<typeof BaseButton> {
  href: string;
  className?: string;
}

const LinkButton = ({
  href,
  className = "w-full",
  ...buttonProps
}: LinkButtonProps) => {
  return (
    <Link href={href} className={className}>
      <BaseButton {...buttonProps} />
    </Link>
  );
};

LinkButton.displayName = "LinkButton";
export default LinkButton;
