import { useId } from "react";

interface ToggleFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  activeColor?: string;
}

const ToggleField = ({
  checked,
  onChange,
  label,
  disabled,
  className,
  width = 50,
  height = 28,
  activeColor = "#76cea0",
}: ToggleFieldProps) => {
  const id = useId();
  const knob = height - 8; // 20px bij default
  const travel = width - knob - 8; // verschuiving van de bol

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 cursor-pointer select-none [-webkit-tap-highlight-color:transparent] ${
        disabled ? "opacity-40 pointer-events-none" : ""
      } ${className ?? ""}`}
      style={
        {
          "--tg-w": `${width}px`,
          "--tg-h": `${height}px`,
          "--tg-knob": `${knob}px`,
          "--tg-travel": `${travel}px`,
          "--tg-active": activeColor,
        } as React.CSSProperties
      }
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="
          peer appearance-none shrink-0 cursor-pointer
          h-(--tg-h) w-(--tg-w) rounded-full bg-studogrey
          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]
          transition-all duration-300 ease-in-out
          checked:bg-(--tg-active)
          checked:shadow-[inset_2px_2px_4px_#5fb18a,inset_-2px_-2px_4px_#9ff8c6]
          after:content-[''] after:absolute after:top-1 after:left-1
          after:h-(--tg-knob) after:w-(--tg-knob) after:rounded-full
          after:bg-zinc-100
          after:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(0,0,0,0.1)]
          after:transition-all after:duration-300 after:ease-in-out
          checked:after:translate-x-(--tg-travel)
          checked:after:shadow-[1px_1px_3px_#5fb18a,-1px_-1px_2px_rgba(255,255,255,0.1)]
          relative
        "
      />
      {label && (
        <span className="text-sm dark:text-white text-studodarkblue">
          {label}
        </span>
      )}
    </label>
  );
};

ToggleField.displayName = "ToggleField";
export default ToggleField;
