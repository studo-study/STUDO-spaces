import { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.mjs";
import { useTranslations } from "next-intl";
import InputField from "./InputField";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { FaCheck } from "react-icons/fa";
import { codeToHtml } from "shiki";
import Select from "@/components/ui/design_system/select/Select";

const CODE_LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
];

interface LaTexInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  contentType: "text" | "latex" | "code";
  setContentType: (value: "text" | "latex" | "code") => void;
  codeLanguage?: string;
  onCodeLanguageChange?: (lang: string) => void;
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
      contentType,
      setContentType,
      codeLanguage = "typescript",
      onCodeLanguageChange,
    } = props;
    const t = useTranslations("latex");

    const [isLatexPreview, setIsLatexPreview] = useState(
      () => contentType === "latex" && value.trim().length > 0,
    );
    const [isCodePreview, setIsCodePreview] = useState(
      () => contentType === "code" && value.trim().length > 0,
    );
    const [highlighted, setHighlighted] = useState<string>("");
    const isTypingRef = useRef(false);

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (contentType === "latex" && value.trim()) setIsLatexPreview(true);
      else if (contentType !== "latex") setIsLatexPreview(false);
    }, [contentType, value]);

    useEffect(() => {
      if (contentType !== "code") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsCodePreview(false);
        return;
      }
      if (!value.trim()) return;

      const isDark = document.documentElement.classList.contains("dark");
      let cancelled = false;
      codeToHtml(value, {
        lang: codeLanguage,
        theme: isDark ? "github-dark" : "github-light",
      })
        .then((result) => {
          if (!cancelled) {
            setHighlighted(result);
            if (!isTypingRef.current) setIsCodePreview(true);
          }
        })
        .catch(() => {
          if (!cancelled) {
            codeToHtml(value, {
              lang: "text",
              theme: isDark ? "github-dark" : "github-light",
            }).then((result) => {
              if (!cancelled) {
                setHighlighted(result);
                if (!isTypingRef.current) setIsCodePreview(true);
              }
            });
          }
        });
      return () => {
        cancelled = true;
      };
    }, [value, contentType, codeLanguage]);

    const handleBlur = () => {
      if (contentType === "latex" && value.trim()) setIsLatexPreview(true);
      if (contentType === "code" && value.trim()) {
        isTypingRef.current = false;
        setIsCodePreview(true);
      }
    };

    const showLatexPreview =
      isLatexPreview && contentType === "latex" && !hidden;
    const showCodePreview =
      isCodePreview && contentType === "code" && !hidden && !!highlighted;

    return (
      <div className={"w-full h-fit flex flex-col gap-1"}>
        <div className="relative min-h-10 w-full items-center flex">
          {showLatexPreview ? (
            <div
              className={"text-xs cursor-pointer"}
              onClick={() => setIsLatexPreview(false)}
            >
              <SafeKaTeX value={value} fallback={value} />
            </div>
          ) : showCodePreview ? (
            <div
              className={
                "text-xs w-full rounded-full h-10 border border-studoborder/30 overflow-hidden px-1 overflow-x-scroll scroll-hidden dark:invert cursor-pointer [&>pre]:p-3 [&>pre]:rounded-xl [&>pre]:text-xs [&>pre]:!bg-transparent"
              }
              onClick={() => {
                isTypingRef.current = true;
                setIsCodePreview(false);
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
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
            className={"w-full flex flex-row justify-end items-center gap-1"}
          >
            {contentType === "code" && onCodeLanguageChange && (
              <Select
                size={"xs"}
                value={codeLanguage}
                onChange={(v) => onCodeLanguageChange(String(v))}
                options={CODE_LANGUAGES.map((lang) => {
                  return { value: lang.value, label: lang.label };
                })}
              />
            )}
            <BaseButton
              type="button"
              onClick={() => {
                isTypingRef.current = false;
                setContentType(contentType === "code" ? "text" : "code");
                setIsCodePreview(false);
              }}
              iconLeft={
                <FaCheck
                  className={`text-emerald-500 opacity-0 ${contentType === "code" && "opacity-100"}`}
                />
              }
              variant={"ghost"}
              size={"xs"}
              className={`font-normal transition-opacity duration-300 ${contentType === "code" && "opacity-100"} hover:text-white opacity-30 hover:opacity-100`}
            >
              {t("Code")}
            </BaseButton>
            <BaseButton
              type="button"
              onClick={() => {
                setContentType(contentType === "latex" ? "text" : "latex");
                setIsLatexPreview(false);
              }}
              iconLeft={
                <FaCheck
                  className={`text-emerald-500 opacity-0 p-0 ${contentType === "latex" && "opacity-100"}`}
                />
              }
              variant={"ghost"}
              size={"xs"}
              className={`font-normal transition-opacity duration-300 ${contentType === "latex" && "opacity-100"} hover:text-white opacity-30 hover:opacity-100`}
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
