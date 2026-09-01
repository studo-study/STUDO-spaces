"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import classNames from "@/utils/classnames";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";
import {
  ChevronDown,
  GraduationCap,
  House,
  LibraryBig,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { ReactNode, useState } from "react";
import CourseSidebar from "@/components/ui/app/private/course/layout/CourseSidebar";
import { useAppLayout } from "@/components/context/AppLayoutContext";
import { useUser } from "@/components/providers/auth/UserProvider";

interface BurgerProps {
  burgerOpen: boolean;
  toggleSearch: () => void;
}

function MenuRow({
  icon,
  text,
  burgerOpen,
  href,
  active = false,
  onClick,
}: {
  icon: ReactNode;
  text: string;
  burgerOpen: boolean;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <div
      className={classNames(
        "flex items-center h-10 w-full rounded-4xl overflow-hidden pr-3",
        "transition-[padding,background-color] duration-500 ease-in-out",
        "dark:hover:bg-studogrey/30 hover:bg-slate-200",
        // icon glijdt van links (open) naar centraal (collapsed) via padding
        burgerOpen ? "pl-3" : "pl-[calc(50%-0.75rem)]",
        active ? "dark:bg-studogrey/30 bg-slate-200" : "",
      )}
    >
      <div className="flex items-center justify-center shrink-0 w-6 text-2xl dark:text-white">
        {icon}
      </div>
      <span
        className={classNames(
          "dark:text-white select-none whitespace-nowrap transition-[opacity,max-width,margin] duration-500 ease-in-out",
          burgerOpen ? "opacity-100 max-w-40 ml-3" : "opacity-0 max-w-0 ml-0",
        )}
      >
        {text}
      </span>
    </div>
  );

  const className = classNames(
    "w-full h-10",
    onClick ? "cursor-pointer" : "",
    active ? "opacity-75" : "opacity-50",
  );

  return (
    <BaseTooltip content={text} position={"right"} hidden={burgerOpen}>
      {href ? (
        <Link href={href} className={className}>
          {inner}
        </Link>
      ) : (
        <div onClick={onClick} className={className}>
          {inner}
        </div>
      )}
    </BaseTooltip>
  );
}

function CollapsibleSection({
  title,
  burgerOpen,
  defaultOpen = true,
  children,
}: {
  title: string;
  burgerOpen: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const showChildren = !burgerOpen || open;

  return (
    <div className="flex flex-col gap-1">
      {burgerOpen ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between px-3 py-1 min-h-6 max-h-6 rounded-full select-none cursor-pointer text-[11px] uppercase tracking-wider text-studodarkblue/40 dark:text-white/30 hover:bg-studogrey/10 transition-colors duration-200"
        >
          <span>{title}</span>
          <ChevronDown
            size={14}
            className={classNames(
              "transition-transform duration-200",
              !open && "-rotate-90",
            )}
          />
        </button>
      ) : (
        <div className="min-h-6 max-h-6" />
      )}
      {showChildren && <div className="flex flex-col gap-1">{children}</div>}
    </div>
  );
}

export default function BurgerMenu({ burgerOpen, toggleSearch }: BurgerProps) {
  const t = useTranslations("header");
  const { toggleCreate } = useAppLayout();
  const { isModerator } = useUser();
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
  const isActive = (link: string) =>
    pathWithoutLocale === link || pathWithoutLocale.startsWith(link + "/");

  return (
    <div
      className={`h-full select-none border-neutral-200/30
            transition-[width] duration-500 ease-in-out flex flex-col gap-10 py-10 pb-5 px-3
            ${burgerOpen ? "w-57" : "w-30"}`}
    >
      <MenuRow
        icon={<House size={20} />}
        text={t("home")}
        burgerOpen={burgerOpen}
        href="/home"
        active={isActive("/home")}
      />

      <CollapsibleSection title={t("courses")} burgerOpen={burgerOpen}>
        <CourseSidebar burgerOpen={burgerOpen} />
        <MenuRow
          icon={<Plus size={20} />}
          text={t("create_btn")}
          burgerOpen={burgerOpen}
          onClick={toggleCreate}
        />
      </CollapsibleSection>

      <CollapsibleSection title={t("library")} burgerOpen={burgerOpen}>
        <MenuRow
          icon={<LibraryBig size={20} />}
          text={t("library")}
          burgerOpen={burgerOpen}
          href="/library/courses"
          active={isActive("/library/")}
        />
        <MenuRow
          icon={<GraduationCap size={20} />}
          text={t("groups")}
          burgerOpen={burgerOpen}
          href="/groups"
          active={isActive("/groups")}
        />
        <MenuRow
          icon={<Search size={20} />}
          text={t("search_btn")}
          burgerOpen={burgerOpen}
          onClick={toggleSearch}
        />
      </CollapsibleSection>

      <div className="mt-auto">
        <CollapsibleSection
          title={t("account")}
          burgerOpen={burgerOpen}
          defaultOpen={true}
        >
          <MenuRow
            icon={<User size={20} />}
            text={t("account")}
            burgerOpen={burgerOpen}
            href="/account"
            active={isActive("/account")}
          />
          <MenuRow
            icon={<Settings size={20} />}
            text={t("settings")}
            burgerOpen={burgerOpen}
            href="/settings/account"
            active={isActive("/settings")}
          />
          {isModerator && (
            <MenuRow
              icon={<ShieldCheck size={20} />}
              text={t("ad")}
              burgerOpen={burgerOpen}
              href="/backoffice/stats"
              active={isActive("/backoffice")}
            />
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
}
