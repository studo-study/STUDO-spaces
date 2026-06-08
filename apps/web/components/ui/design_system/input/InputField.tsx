import React, { useEffect, useRef, useImperativeHandle } from "react";

type InputVariant = "default" | "cardInput";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  textarea?: boolean;
}

interface AutoResizeTextareaProps {
  forwardedRef: React.Ref<HTMLInputElement>;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  fontBold?: boolean;
  textSize?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
}

function AutoResizeTextarea({
  forwardedRef,
  placeholder,
  maxLength,
  value,
  fontBold,
  textSize,
  className,
  onChange,
  onKeyDown,
  onBlur,
}: AutoResizeTextareaProps) {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(
    forwardedRef,
    () => innerRef.current as unknown as HTMLInputElement,
  );

  const resize = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={innerRef}
      placeholder={placeholder}
      autoComplete="off"
      maxLength={maxLength}
      value={value}
      rows={1}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onInput={resize}
      className={`flex-1 px-5 py-2.5 min-h-10 overflow-hidden
        outline-none resize-none
        ${fontBold ? "font-bold" : ""}
        ${textSize ? `text-${textSize}` : ""}
        ${className ?? ""}`}
    />
  );
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
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
      textarea,
      ...rest
    } = props;

    if (variant === "cardInput") {
      if (textarea) {
        return (
          <div className="flex-1 flex glass-rgb rounded-3xl justify-between border border-studoborder/30 text-sm">
            <AutoResizeTextarea
              forwardedRef={ref}
              placeholder={placeholder}
              maxLength={maxLength}
              value={value}
              fontBold={fontBold}
              textSize={textSize}
              className={className}
              onChange={
                rest.onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
              }
              onKeyDown={
                rest.onKeyDown as unknown as React.KeyboardEventHandler<HTMLTextAreaElement>
              }
              onBlur={
                rest.onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>
              }
            />
            {maxLength && (
              <div
                className={
                  "pr-5 truncate self-start flex items-center pt-3 p-0"
                }
              >
                <span className={"text-[10px] opacity-30"}>
                  {value?.length} / {maxLength}
                </span>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex-1 flex glass-rgb rounded-3xl justify-between border border-studoborder/30 text-sm">
            <input
              ref={ref}
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
          ref={ref}
          type="text"
          value={initialValue}
          onChange={(e) => setValue?.(e.target.value)}
          placeholder={placeholder}
          className="absolute inset-0 border-none p-0 outline-none w-full bg-transparent"
        />
      </div>
    );
  },
);

InputField.displayName = "InputField";
export default InputField;
