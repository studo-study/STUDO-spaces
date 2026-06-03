type InputVariant = "default" | "cardInput";

interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string;
  fontBold?: boolean;
  textSize?: string;
  initialValue?: string;
  value?: string;
  setValue?: (value: string) => void;
  error?: string;
  width?: string;
  className?: string;
  variant?: InputVariant;
  maxLength?: number;
}

const InputField = (props: InputFieldProps) => {
  const {
    placeholder,
    value,
    className,
    fontBold,
    textSize,
    setValue,
    error,
    initialValue,
    width,
    variant = "default",
    maxLength,
    ...rest
  } = props;

  if (variant === "cardInput") {
    return (
      <div
        className={
          " flex-1 flex glass-rgb rounded-3xl justify-between   border border-studoborder/30 text-sm"
        }
      >
        <input
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          maxLength={maxLength}
          value={value}
          {...rest}
          className={`h-10 px-5 w-full
          relative outline-none

          ${error ? "border-b-rose-500" : ""}
          ${fontBold ? "font-bold" : ""}
          ${textSize ? `text-${textSize}` : ""}
          ${className ?? ""}`}
        />
        {maxLength && (
          <div className={"pr-5 truncate min-h-full flex items-center p-0"}>
            <span className={"text-[10px] opacity-30"}>
              {value?.length} / {maxLength}
            </span>
          </div>
        )}
      </div>
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
