import { useState, useEffect, useMemo, forwardRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.mjs";
import { useTranslations } from "next-intl";
import InputField from "./InputField";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { FaCheck } from "react-icons/fa";

interface LaTexInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  isLatex: boolean;
  setIsLatex: (value: boolean) => void;
}

const LaTexInput = forwardRef<HTMLInputElement, LaTexInputProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      placeholder,
      error,
      onKeyDown,
      hidden,
      isLatex,
      setIsLatex,
    } = props;
    const t = useTranslations("latex");

    const [isPreview, setIsPreview] = useState(
      () => isLatex && value.trim().length > 0,
    );

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isLatex && value.trim()) setIsPreview(true);
      else if (!isLatex) setIsPreview(false);
    }, [isLatex, value]);

    const handleBlur = () => {
      if (isLatex && value.trim()) {
        setIsPreview(true);
      }
    };

    /*
  const handlePreviewClick = () => {
    setIsPreview(false);
  };*/

    return (
      <div className={"w-full h-fit flex flex-col gap-1"}>
        <div className="relative min-h-10 w-full items-center flex">
          {isPreview && isLatex && !hidden ? (
            <SafeKaTeX value={value} fallback={value} />
          ) : (
            <InputField
              ref={ref}
              variant="cardInput"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              error={error}
            />
          )}
        </div>
        {!hidden && (
          <div
            className={"w-full flex flex-row gap-2 justify-end items-center"}
          >
            <BaseButton
              type="button"
              onClick={() => {
                setIsLatex(!isLatex);
                setIsPreview(false);
              }}
              iconLeft={
                isLatex ? <FaCheck className={"text-emerald-500"} /> : null
              }
              variant={"ghost"}
              size={"xs"}
              className={`font-normal transition-opacity ${isLatex && "opacity-100"} hover:text-white opacity-30 hover:opacity-100`}
            >
              {t("LaTeX")}
            </BaseButton>
          </div>
        )}
      </div>
    );
  },
);

LaTexInput.displayName = "LaTexInput";

export default LaTexInput;

const SafeKaTeX = ({ value }: { value: string; fallback: string }) => {
  const html = useMemo(
    () =>
      katex.renderToString(value, { throwOnError: false, displayMode: false }),
    [value],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
