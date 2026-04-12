interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
    placeholder?: string;
    fontBold?: boolean;
    textSize?: string;
    setValue?: (value: string) => void;
    error?: string;
}

const InputField = (props: InputFieldProps) => {
    const { placeholder, fontBold, textSize, setValue, error } = props;
    return (
        <div className={`min-w-full w-full ${error ? "border border-transparent border-b-rose-500" : null} transparent ${fontBold ? "font-bold" : ""} ${textSize ? `text-${textSize}` : ""} dark:text-white text-studodarkblue`}>
            <input
                type="text"
                onChange={(e) => setValue?.(e.target.value)}
                placeholder={placeholder}
                className="border-none outline-none min-w-full bg-transparent"
            />
        </div>
    );
};

InputField.displayName = "InputField";
export default InputField;