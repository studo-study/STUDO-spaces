type InputVariant = "default" | "cardInput";

interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string;
  fontBold?: boolean;
  textSize?: string;
  initialValue?: string;
  setValue?: (value: string) => void;
  error?: string;
  width?: string;
  className?: string;
  variant?: InputVariant;
}

const InputField = (props: InputFieldProps) => {
  const {
    placeholder,
    className,
    fontBold,
    textSize,
    setValue,
    error,
    initialValue,
    width,
    variant = "default",
    ...rest
  } = props;

  if (variant === "cardInput") {
    return (
      <input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        {...rest}
        className={`
          w-full h-10 px-5 rounded-full glass-rgb
          border border-studoborder/30 text-sm outline-none
          ${error ? "border-b-rose-500" : ""}
          ${fontBold ? "font-bold" : ""}
          ${textSize ? `text-${textSize}` : ""}
          ${className ?? ""}`}
      />
    );
  }

  const displayValue = initialValue || placeholder || "";

  return (
    <div
      className={`
        relative
        ${width ?? "w-fit"}
        ${error ? "border border-transparent border-b-rose-500" : ""} transparent
        ${fontBold ? "font-bold" : ""}
        ${className ?? ""}
        ${textSize ? `text-${textSize}` : ""}
        dark:text-white text-studodarkblue`}
    >
      <span className="invisible whitespace-pre">{displayValue}</span>
      <input
        type="text"
        value={initialValue}
        onChange={(e) => setValue?.(e.target.value)}
        placeholder={placeholder}
        className="absolute inset-0 border-none p-0 outline-none w-full bg-transparent"
      />
    </div>
  );
};

InputField.displayName = "InputField";
export default InputField;
