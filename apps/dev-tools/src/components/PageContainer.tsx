const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={"w-full h-full flex items-center justify-center"}>
      <div className={"max-w-300 w-full h-full flex-1 min-h-0 overflow-y-auto"}>
        {children}
      </div>
    </div>
  );
};
PageContainer.displayName = "PageContainer";
export default PageContainer;
