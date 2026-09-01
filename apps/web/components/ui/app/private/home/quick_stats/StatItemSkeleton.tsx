const StatItemSkeleton = () => {
  return (
    <div
      className={`w-full h-10 text-sm flex font-bold items-center justify-center dark:bg-studogrey/30 bg-zinc-300 dark:text-white text-studodarkblue gap-2 rounded-full border border-transparent dark:border-neutral-200/30`}
    />
  );
};

StatItemSkeleton.displayName = "StatItemSkeleton";
export default StatItemSkeleton;
