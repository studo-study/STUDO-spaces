import { useEffect, useRef } from "react";

interface TextAreaProps {
  placeholder?: string;
  fontBold?: boolean;
  textSize?: string;
  value?: string;
  setValue?: (value: string) => void;
  error?: string;
  width?: string;
  className?: string;
}

const TextArea = (props: TextAreaProps) => {
  const {
    placeholder,
    className,
    fontBold,
    textSize,
    value,
    setValue,
    error,
    width,
  } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div
      className={`
            ${width ?? "w-full"} 
            ${error ? "border border-transparent border-b-rose-500" : ""} 
            ${fontBold ? "font-bold" : ""} 
            ${className ?? ""}
            ${textSize ? `text-${textSize}` : ""} 
            dark:text-white text-studodarkblue h-full`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue?.(e.target.value)}
        placeholder={placeholder}
        rows={1}
        className="w-full border-none h-fit resize-none p-0 outline-none bg-transparent overflow-hidden"
      />
    </div>
  );
};
TextArea.displayName = "TextArea";
export default TextArea;
