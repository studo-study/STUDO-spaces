"use client";
import { useImpersonation } from "@/hooks/app/auth/useImpersonation";
import classNames from "@/utils/classnames";

const BottomShade = () => {
  const { impersonating } = useImpersonation();
  return (
    <div
      className={classNames(
        "fixed z-10 bottom-5.5 h-25 w-2/3 bg-linear-0 ",
        impersonating
          ? "from-emerald-800 to-transparent"
          : "dark:from-slate-800 from-bg-white to-transparent",
      )}
    />
  );
};

BottomShade.displayName = "BottomShade";
export default BottomShade;
