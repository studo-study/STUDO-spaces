"use client";
import { SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface FlowHeadingProps {
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<SetStateAction<string>>;
}
const FlowHeading: React.FC<FlowHeadingProps> = (props) => {
  const { title, setTitle, description, setDescription } = props;
  const t = useTranslations("flow.course.table");
  return (
    <div className={"flex flex-col gap-5 pt-10 w-full h-fit"}>
      <div className={"flex flex-row items-center justify-between"}>
        <input
          placeholder={t("title")}
          className={"font-bold text-2xl outline-none"}
          type="text"
          autoFocus={title.length === 0}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <textarea
        placeholder={t("description")}
        className="font-medium outline-none resize-none overflow-hidden"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);

          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
    </div>
  );
};

FlowHeading.displayName = "FlowHeading";
export default FlowHeading;
