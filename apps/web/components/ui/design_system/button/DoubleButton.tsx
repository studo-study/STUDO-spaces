import classNames from "@/utils/classnames";

interface DoubleButtonProps extends Omit<
  React.HTMLProps<HTMLButtonElement>,
  "size" | "type"
> {
  buttonIconLeft?: React.ReactNode;
  buttonIconRight?: React.ReactNode;
  labelLeft?: string;
  labelRight?: string;
  onSubmitLeft?: () => void;
  onSubmitRight?: () => void;
  leftIsDisabled?: boolean;
  rightIsDisabled?: boolean;
  isLoading?: boolean;
  leftType?: "button" | "submit" | "reset";
  rightType?: "button" | "submit" | "reset";
  bg?: string;
  rounded?: string;
  px?: string;
  error?: string;
}

const DoubleButton: React.FC<DoubleButtonProps> = (props) => {
  const {
    label,
    leftType = "button",
    rightType = "button",
    buttonIconLeft,
    buttonIconRight,
    onSubmitLeft,
    onSubmitRight,
    onClick,
    width,
    bg,
    children,
    rounded,
    shape,
    isLoading,
    disabled,
    px,
    className,
    leftIsDisabled,
    rightIsDisabled,
    ...rest
  } = props;

  return (
    <div
      className={classNames(
        "dark:text-white rounded-full border border-studoborder/30 flex flex-row gap-2 p-1.5 bg-studogrey/30",
      )}
    >
      <button
        className={
          "cursor-pointer w-7 h-7 rounded-full flex items-center justify-center border transition-transform active:scale-95 duration-300 border-studoborder/30 bg-studogrey/30"
        }
        type={leftType}
        disabled={disabled || leftIsDisabled || isLoading}
        onClick={onClick ?? onSubmitLeft}
        style={{ width: width as string | number | undefined }}
        {...rest}
      >
        {buttonIconLeft}
        {isLoading ? "laden..." : label}
        {children}
      </button>
      <button
        className={
          "cursor-pointer w-7 h-7 rounded-full flex items-center justify-center border transition-transform active:scale-95 duration-300 border-studoborder/30 bg-studogrey/30"
        }
        type={rightType}
        disabled={disabled || rightIsDisabled || isLoading}
        onClick={onClick ?? onSubmitRight}
        style={{ width: width as string | number | undefined }}
        {...rest}
      >
        {buttonIconRight}
        {isLoading ? "laden..." : label}
        {children}
      </button>
    </div>
  );
};

DoubleButton.displayName = "DoubleButton";
export default DoubleButton;
