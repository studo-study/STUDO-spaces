interface PageContainerProps extends React.HTMLProps<HTMLDivElement> {
  gap?: number;
}

const PageContainer = (props: PageContainerProps) => {
  const { gap, children } = props;
  return (
    <div
      className={
        "w-full h-full flex flex-col items-center justify-center  2xl:py-15 xl:py-5 2xl:pt-5 scroll-hidden"
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
