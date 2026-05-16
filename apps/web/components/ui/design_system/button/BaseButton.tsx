interface BaseButtonProps extends React.HTMLProps<HTMLButtonElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  onSubmit?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  bg?: string;
  rounded?: string;
}

const BaseButton = (props: BaseButtonProps) => {
  const {
    label,
    icon,
    iconLeft,
    iconRight,
    onSubmit,
    width,
    bg,
    children,
    rounded,
  } = props;
  return (
    <button
      className={`${rounded ? "rounded-" + rounded : "rounded-full"} cursor-pointer border active:scale-95 transition-all duration-300 hover:border-studoborder border-studoborder/30 ${bg && bg} font-bold text:text-studodarkblue dark:text-white flex flex-row gap-2 items-center justify-center px-5 py-2 cursor-pointer`}
      style={{ width: width }}
      type={"button"}
      onClick={onSubmit}
      {...props}
    >
      {iconLeft}
      {label && label}
      {icon}
      {iconRight}
      {children}
    </button>
  );
};

BaseButton.displayName = "BaseButton";
export default BaseButton;
