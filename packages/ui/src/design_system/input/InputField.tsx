"use client";

import * as React from "react";
import classNames from "@studo/utils/classnames";

export type InputVariant = "default" | "cardInput" | "inputfield";

type VariantStyle = {
  wrapper: string;
  control: string;
};

const VARIANTS: Record<InputVariant, VariantStyle> = {
  default: {
    wrapper: "relative flex items-center text-studodarkblue dark:text-white",
    control: "w-full border-none bg-transparent p-0 outline-none",
  },
  cardInput: {
    wrapper:
      "glass-rgb flex flex-1 justify-between rounded-3xl border border-studoborder/30 text-sm",
    control: "min-w-0 flex-1 bg-transparent px-5 outline-none",
  },
  inputfield: {
    wrapper:
      "flex w-full items-center rounded-2xl border border-studoborder/30 bg-white/5 text-sm",
    control: "min-w-0 flex-1 bg-transparent px-4 outline-none",
  },
};

const TEXT_SIZES = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
} as const;

export type TextSize = keyof typeof TEXT_SIZES;

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

export type InputFieldElement = HTMLInputElement | HTMLTextAreaElement;

type BaseProps = {
  variant?: InputVariant;
  label?: string;
  error?: string;
  hint?: string;
  fontBold?: boolean;
  textSize?: TextSize;
  stretch?: boolean;
  width?: string;
  className?: string;
  inputClassName?: string;
  showCount?: boolean;
  autoWidth?: boolean;
  /** Element rechts in het veld, bv. een oogje om een wachtwoord te tonen. */
  iconRight?: React.ReactNode;
  onValueChange?: (value: string) => void;
  setValue?: (value: string) => void;
  initialValue?: string;
};

type InputOnly = Omit<
  React.ComponentPropsWithoutRef<"input">,
  keyof BaseProps | "size"
>;
type TextareaOnly = Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  keyof BaseProps
>;

export type InputFieldProps = BaseProps &
  (({ textarea: true } & TextareaOnly) | ({ textarea?: false } & InputOnly));

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function useComposedRef<T>(...refs: Array<React.Ref<T> | undefined>) {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

/** Groeit mee met de inhoud, ook bij een resize van de container. */
function useAutoResize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: unknown,
  enabled: boolean,
) {
  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref]);

  // useLayoutEffect voorkomt een frame met de verkeerde hoogte.
  React.useLayoutEffect(() => {
    if (enabled) resize();
  }, [enabled, resize, value]);

  React.useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, ref, resize]);

  return resize;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

function InputFieldImpl(
  props: InputFieldProps,
  forwardedRef: React.Ref<InputFieldElement>,
) {
  const {
    variant = "default",
    textarea = false,
    label,
    error,
    hint,
    fontBold,
    textSize,
    stretch = true,
    width,
    className,
    inputClassName,
    showCount,
    iconRight,
    // De ghost-span krimptruc slaat enkel op een veld dat niet stretcht.
    autoWidth = !stretch && variant === "default",
    onValueChange,
    setValue,
    initialValue,
    value: valueProp,
    defaultValue,
    maxLength,
    placeholder,
    disabled,
    id: idProp,
    onChange,
    ...rest
  } = props;

  const reactId = React.useId();
  const id = idProp ?? reactId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // `initialValue` was in de praktijk gewoon de controlled value.
  const value = valueProp ?? initialValue;
  const isControlled = value !== undefined;

  const innerRef = React.useRef<InputFieldElement>(null);
  const ref = useComposedRef(innerRef, forwardedRef);

  const [uncontrolledLength, setUncontrolledLength] = React.useState(
    () => String(defaultValue ?? "").length,
  );
  const length = isControlled ? String(value).length : uncontrolledLength;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isControlled) setUncontrolledLength(event.target.value.length);
    onValueChange?.(event.target.value);
    setValue?.(event.target.value);
    (onChange as React.ChangeEventHandler<InputFieldElement> | undefined)?.(
      event,
    );
  };

  useAutoResize(
    innerRef as React.RefObject<HTMLTextAreaElement | null>,
    value,
    textarea,
  );

  const styles = VARIANTS[variant];
  const withCount =
    (showCount ?? maxLength !== undefined) && maxLength !== undefined;

  const controlClassName = classNames(
    styles.control,
    textarea
      ? "min-h-10 resize-none overflow-hidden py-2.5"
      : variant === "default"
        ? null
        : "h-10",
    autoWidth ? "absolute inset-0" : "w-full",
    fontBold && "font-bold",
    textSize && TEXT_SIZES[textSize],
    disabled && "cursor-not-allowed opacity-50",
    // Verbergt de browser-autofill-highlight + native reveal/clear-knoppen
    // (Firefox/Edge/webkit) zodat enkel onze eigen UI zichtbaar is.
    !textarea && "input-clean",
    inputClassName,
  );

  const sharedProps = {
    id,
    ref: ref as React.Ref<never>,
    placeholder,
    disabled,
    maxLength,
    autoComplete: "off" as const,
    "aria-invalid": error ? true : undefined,
    "aria-describedby":
      classNames(error && errorId, hint && hintId).trim() || undefined,
    onChange: handleChange,
    className: controlClassName,
    ...(isControlled ? { value } : { defaultValue }),
  };

  return (
    <div
      className={classNames(
        "flex flex-col gap-1",
        width ?? (stretch ? "w-full min-w-0 flex-1" : "w-fit"),
      )}
    >
      {label && (
        <label htmlFor={id} className="text-xs opacity-60 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={classNames(
          styles.wrapper,
          textarea && "items-start",
          error && "border-rose-500",
          className,
        )}
      >
        {/* Ghost span duwt de wrapper naar de breedte van de inhoud. */}
        {autoWidth && (
          <span aria-hidden className="invisible whitespace-pre">
            {String(value ?? defaultValue ?? "") || placeholder || " "}
          </span>
        )}

        {textarea ? (
          <textarea
            rows={1}
            {...sharedProps}
            {...(rest as React.ComponentPropsWithoutRef<"textarea">)}
          />
        ) : (
          <input
            type="text"
            {...sharedProps}
            {...(rest as React.ComponentPropsWithoutRef<"input">)}
          />
        )}

        {withCount && (
          <span
            aria-hidden
            className={classNames(
              "shrink-0 pr-5 text-[10px] tabular-nums opacity-30",
              textarea ? "self-start pt-3.5" : "self-center",
              length >= maxLength && "text-rose-500 opacity-100",
            )}
          >
            {length} / {maxLength}
          </span>
        )}

        {iconRight && (
          <span
            className={classNames(
              "flex shrink-0 items-center pr-3",
              textarea ? "self-start pt-3" : "self-center",
            )}
          >
            {iconRight}
          </span>
        )}
      </div>

      {error ? (
        <span id={errorId} role="alert" className="text-xs text-rose-500">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-xs opacity-50">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

const InputField = React.forwardRef(InputFieldImpl) as (
  props: InputFieldProps & { ref?: React.Ref<InputFieldElement> },
) => React.ReactElement;

export default InputField;
