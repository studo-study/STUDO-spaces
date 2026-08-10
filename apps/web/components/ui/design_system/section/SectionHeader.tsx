import { ReactNode } from "react";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  href?: string;
  sectionIcon?: ReactNode;
}

const SectionHeader = (props: SectionHeaderProps) => {
  const { title, linkText, href, sectionIcon } = props;
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 items-center dark:text-white/75 text-studodarkblue">
        {sectionIcon}
        <span className="w-full text-lg font-bold ">{title}</span>
      </div>
      {href && (
        <Link
          href={href}
          className="w-1/2 flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30"
        >
          {linkText}
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
