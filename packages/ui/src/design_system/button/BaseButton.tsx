interface BaseButtonProps extends Omit<
  React.HTMLProps<HTMLButtonElement>,
  "size" | "type"
> {
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
  px?: string;
  variant?: BaseButtonVariant;
  size?: keyof typeof sizeMap;
  gradient?: keyof typeof gradientMap;
  textColor?: keyof typeof textColorMap;
  textSize?: keyof typeof textSizeMap;
  borderColor?: keyof typeof borderMap;
  shape?: keyof typeof shapeMap;
  error?: string;
}

export type BaseButtonVariant = keyof typeof variantMap;

const textColorMap = {
  white: "text-white",
  black: "text-black",
  studodarkblue: "text-studodarkblue dark:text-white",
} as const;

const textSizeMap = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
} as const;

const borderMap = {
  default: "border border-studoborder/30 hover:border-studoborder",
  red: "border border-red-500",
} as const;

const sizeMap = {
  xs: "py-1 px-2 text-xs",
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-2 px-5",
  xl: "py-4 px-6 text-lg",
  icon: "p-2 aspect-square",
} as const;

const variantMap = {
  primary:
    "bg-emerald-500 text-white shadow-2xl px-5 min-h-full h-12 rounded-full max-w-fit disabled:cursor-not-allowed disabled:active:scale-100",
  danger:
    "bg-rose-500 text-white shadow-2xl px-5 min-h-full h-12 rounded-full max-w-fit disabled:cursor-not-allowed disabled:active:scale-100",
  danger_outline:
    "bg-rose-500/30 text-white shadow-2xl px-5 min-h-full h-10 rounded-lg max-w-fit disabled:cursor-not-allowed disabled:active:scale-100 border-rose-500",
  outline: "border border-gray-300 text-black dark:text-white",
  outline_link:
    "border border-studoborder dark:bg-studogrey/30 text-studodarkblue dark:text-white w-full",
  prompt: "border border-zinc-300 text-zinc-500",
  ghost:
    "text-studodarkblue dark:text-white border-none hover:text-studoblue transition-colors duration-200 active:scale-100",
  approve:
    "text-white bg-emerald-500 px-5 min-h-fit h-12 rounded-full max-w-fit max-h-12",
  submit:
    "bg-blue-500 text-white shadow-2xl px-5 min-h-full h-12 rounded-full max-w-fit disabled:cursor-not-allowed disabled:active:scale-100",
  default: "text-studodarkblue dark:text-white",
  icon: "h-fit px-0  py-0 rounded-full border border-studoborder/30 bg-studogrey/30",
  plus: "shadow-2xl bg-blue-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder",
  hover:
    "hover:bg-studogrey/30 text-studodarkblue dark:text-white backdrop-blur-sm transition-[colors, scale] duration-200 border-none truncate",
} as const;

const shapeMap = {
  rectangle: "",
  square: "!p-2 aspect-square",
  circle: "!p-2 aspect-square",
} as const;

const gradientMap = {
  "rose-blue": "bg-gradient-to-r from-rose-500 to-blue-500",
  "purple-pink": "bg-gradient-to-r from-purple-500 to-pink-500",
} as const;

const BaseButton = (props: BaseButtonProps) => {
  const {
    label,
    icon,
    iconLeft,
    iconRight,
    onSubmit,
    onClick,
    width,
    bg,
    children,
    rounded,
    variant = "default",
    size = "lg",
    gradient,
    textColor,
    textSize,
    borderColor = "default",
    shape,
    isLoading,
    isDisabled,
    disabled,
    type = "button",
    px,
    className,
    ...rest
  } = props;

  const classes = [
    shape === "square"
      ? "rounded-xl"
      : rounded
        ? `rounded-${rounded}`
        : "rounded-full",
    "cursor-pointer active:scale-95 transition-all duration-300",
    "disabled:opacity-20 disabled:cursor-not-allowed truncate",
    "font-bold flex flex-row gap-2 items-center justify-center",
    gradient ? gradientMap[gradient] : variantMap[variant],
    sizeMap[size],
    borderMap[borderColor],
    textColor ? textColorMap[textColor] : "",
    textSize ? textSizeMap[textSize] : "",
    shape ? shapeMap[shape] : "",
    bg,
    px,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled || isDisabled || isLoading}
      onClick={onClick ?? onSubmit}
      className={classes}
      style={{ width: width as string | number | undefined }}
      {...rest}
    >
      {iconLeft}
      {icon}
      {isLoading ? "laden..." : label}
      {iconRight}
      {children}
    </button>
  );
};

BaseButton.displayName = "BaseButton";
export default BaseButton;
