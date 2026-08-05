"use client";
import Image from "next/image";

interface EmptyFallbackProps {
  title?: string;
  message?: string;
}
const EmptyFallback: React.FC<EmptyFallbackProps> = (props) => {
  const { title, message } = props;
  return (
    <div
      className={
        "min-w-0 min-h-0 flex-1 flex flex-col items-center justify-center gap-4"
      }
    >
      <Image
        src={"/vectors/workplace.png"}
        alt={"lamp"}
        width={200}
        height={200}
        className={"h-30 w-fit saturate-0 opacity-75"}
      />

      <div className={"flex flex-col items-center justify-center gap-2"}>
        <span className={"dark:text-white text-2xl font-bold"}>{title}</span>
        <p className={"dark:text-studogrey text-gray-400 text-sm"}>{message}</p>
      </div>
    </div>
  );
};

EmptyFallback.displayName = "EmptyFallback";
export default EmptyFallback;
