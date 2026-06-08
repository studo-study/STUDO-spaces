"use client";
import { FlowResourceResponse } from "@studo/types";
import Image from "next/image";
import { useState } from "react";
import { Linkparser } from "@/components/ui/app/private/flow/page/CoursePage/linkparser";
import { IoIosClose } from "react-icons/io";

interface ResourceIconProps {
  input: FlowResourceResponse;
  deleteable?: boolean;
  onDelete?: (input: string) => void;
}

interface ParsedInputType {
  name: string;
  icon: string;
}
const ResourceIcon = (props: ResourceIconProps) => {
  const { input, deleteable, onDelete } = props;
  const [parsedInput] = useState<ParsedInputType>(Linkparser(input.link));
  const handleLink = () => {
    window.open(input.link, "_blank");
  };

  return (
    <div
      className={
        "min-w-fit truncate flex hover:border-studoborder flex-row gap-1 text-xs items-center px-2 rounded-full border border-studoborder/30 py-0.5 bg-studogrey/30"
      }
      onClick={deleteable ? () => onDelete?.(input.link) : handleLink}
    >
      <Image
        src={`/icons/resource_icons/${parsedInput.icon}`}
        height={20}
        width={20}
        alt={parsedInput.name}
        className="h-3 w-fit"
      />
      {parsedInput.name}
      {deleteable && (
        <div>
          <IoIosClose />
        </div>
      )}
    </div>
  );
};

ResourceIcon.displayName = "ResourceIcon";
export default ResourceIcon;
