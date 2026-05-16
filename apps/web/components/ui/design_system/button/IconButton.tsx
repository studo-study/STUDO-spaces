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
}

const IconButton = (props: BaseButtonProps) => {
  const { icon, onSubmit, bg } = props;
  return (
    <button
      className={`rounded-full border border-transparent active:scale-95 transition-all min-w-7 min-h-7 duration-300 hover:border-studoborder/30 ${bg && bg} font-bold dark:text-white text-studodarkblue flex flex-row items-center justify-center p-1 cursor-pointer`}
      type={"button"}
      onClick={onSubmit}
      {...props}
    >
      {icon && icon}
    </button>
  );
};

IconButton.displayName = "IconButton";
export default IconButton;
