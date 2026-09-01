interface ContainerType extends React.HTMLProps<HTMLDivElement> {
  width?: string;
  height?: string;
  className?: string;
}

const Container = (props: ContainerType) => {
  const { children, className } = props;
  return (
    <div
      className={`relative overflow-hidden p-5 flex flex-col gap-3 ${className} h-full rounded-3xl border border-neutral-200/30 bg-studogrey/30`}
    >
      {children}
    </div>
  );
};

Container.displayName = "Container";
export default Container;
