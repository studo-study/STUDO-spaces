import Image from "next/image";

export default function ClassroomPopup() {
  return (
    <div
      className="inline-flex cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-[#2a3a42] justify-center
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
    >
      <Image
        src={"/icons/classroom.svg"}
        width={20}
        height={20}
        className="h-4 sm:h-5 dark:invert dark:brightness-0"
        alt=""
      />
    </div>
  );
}
