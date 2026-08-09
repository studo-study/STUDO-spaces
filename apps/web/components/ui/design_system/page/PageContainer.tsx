"use client";
import { usePathname } from "@/i18n/routing";

interface PageContainerProps extends React.HTMLProps<HTMLDivElement> {
  gap?: number;
}

const PageContainerRoutes = ["course", "admin", "select"];
const PageContainer = (props: PageContainerProps) => {
  const path = usePathname().split("/")[1];
  console.log(path);
  const coursePath = PageContainerRoutes.includes(path);
  const { gap, children } = props;

  if (coursePath) {
    return (
      <div className={"min-w-0 min-h-0 flex-1 flex h-full w-full"}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={
        "w-full h-full flex flex-col items-center justify-center  2xl:py-15 xl:py-15 2xl:pt-15 scroll-hidden"
      }
    >
      <div
        className={` relative w-full 2xl:max-w-4xl max-w-2xl min-h-full h-full ${gap ? "gap-" + gap : "gap-5"} flex items-center flex-col scroll-hidden dark:text-white text-studodarkblue`}
      >
        {children}
      </div>
    </div>
  );
};

PageContainer.displayName = "PageContainer";
export default PageContainer;
