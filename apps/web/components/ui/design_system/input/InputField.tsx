interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string;
  fontBold?: boolean;
  textSize?: string;
  initialValue?: string;
  setValue?: (value: string) => void;
  error?: string;
  width?: string;
  className?: string;
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
  } = props;

  const displayValue = initialValue || placeholder || "";

  return (
    <div
      className={`
        relative
        ${width ?? "w-fit"} 
        ${error ? "border border-transparent border-b-rose-500" : null} transparent 
        ${fontBold ? "font-bold" : ""} 
        ${className && className}
        ${textSize ? `text-${textSize}` : ""} 
        dark:text-white text-studodarkblue`}
    >
      <span className="invisible whitespace-pre">{displayValue}</span>
      <input
        type="text"
        value={initialValue}
        onChange={(e) => setValue?.(e.target.value)}
        placeholder={placeholder}
        className={`absolute inset-0 border-none p-0 outline-none w-full bg-transparent`}
      />
    </div>
  );
};

InputField.displayName = "InputField";
export default InputField;
