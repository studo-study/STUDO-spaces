interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
    placeholder?: string;
    fontBold?: boolean;
    textSize?: string;
}
const InputField = (props: InputFieldProps) => {
    const {placeholder, fontBold, textSize} = props;
    return <div className={`min-w-full w-full transparent ${fontBold && "font-bold"} ${textSize && `text-${textSize}`} dark:text-white text-studodarkblue `}>
        <input type="text" placeholder={placeholder && placeholder} className={"border-none outline-none min-w-full"}/>
    </div>
}

InputField.displayName = "InputField";
export default InputField;