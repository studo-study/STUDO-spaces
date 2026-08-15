"use client";
import InputField from "@studo/ui/design_system/input/InputField";
import { useLocale, useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import LinkButton from "@studo/ui/design_system/button/LinkButton";
import GoogleIcon from "@/components/ui/overige/icons/companies/Google";
import MicrosoftIcon from "@/components/ui/overige/icons/companies/Microsoft";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useRegisterForm } from "@/hooks/overige/useRegisterForm";

const LoginForm = () => {
  const t = useTranslations("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/home`;
  const toast = useToast();

  const { loginGoogle, loginMicrosoft } = useRegisterForm();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // next-auth geeft bij foute credentials een generieke code terug (geen
      // bruikbare boodschap), dus tonen we een vertaalde generieke melding.
      if (result?.error) {
        setLoading(false);
        toast.error(t("failed"));
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setLoading(false);
      toast.error(t("failed"));
    }
  };

  return (
    <div
      className={
        "min-w-0 max-w-100 h-fit flex-1 flex text-studodarkblue dark:text-white flex-col items-center justify-center"
      }
    >
      <AnimateOnMount>
        <div className={"mb-10 flex min-w-full flex-col items-center"}>
          <h1 className="text-4xl font-bolde">{t("Welcome back")}</h1>
          <p className="text-slate-400 text-sm">{t("log into account")}</p>
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={200} className={"min-w-full"}>
        <div className={"max-h-fit w-full gap-5 flex flex-col"}>
          <BaseButton
            onClick={loginGoogle}
            variant={"outline_link"}
            className={"min-h-12 gap-5 flex flex-row font-medium text-base"}
          >
            <GoogleIcon size={20} />
            <span className={"font-medium text-sm"}> {t("Google")}</span>
          </BaseButton>
          <BaseButton
            onClick={loginMicrosoft}
            variant={"outline_link"}
            className={"min-h-12 gap-5 flex flex-row"}
          >
            <MicrosoftIcon size={20} />
            <span className={"font-medium text-sm"}> {t("Microsoft")}</span>
          </BaseButton>
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={400} className={"min-w-full"}>
        <div
          className={
            "h-fit my-8 max-w-100 min-w-full flex flex-row items-center justify-center gap-3"
          }
        >
          <hr className={"min-w-0 flex-1 h-px bg-studogrey/30 border-none"} />
          <span className="min-w-fit text-xs text-slate-500">
            {t("or log in with")}
          </span>
          <hr className={"min-w-0 flex-1 h-px bg-studogrey/30 border-none"} />
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={600} className={"min-w-full"}>
        <div className={"max-h-fit w-full gap-5 flex flex-col mb-5"}>
          <InputField
            className="min-h-12 items-center"
            variant="cardInput"
            type="email"
            autoComplete="email"
            placeholder={t("email")}
            onValueChange={setEmail}
          />
          <InputField
            iconRight={
              <BaseButton
                variant={"ghost"}
                size={"sm"}
                shape={"square"}
                type={"button"}
                onClick={() => setIsOpen((prev) => !prev)}
                icon={open ? <EyeClosed size={20} /> : <Eye size={20} />}
              />
            }
            type={open ? "text" : "password"}
            className="min-h-12 items-center"
            variant="cardInput"
            autoComplete="current-password"
            placeholder={t("password")}
            onValueChange={setPassword}
          />
          <div className={"max-h-10 my-5"}>
            <BaseButton
              variant={"submit"}
              iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
              className={"min-w-full"}
              label={loading ? t("loading") : t("Log In")}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </AnimateOnMount>
      <AnimateOnMount delay={800} className={"min-w-full"}>
        <p
          className={`text-center text-sm text-slate-500 transition-all duration-500 delay-600`}
        >
          {t("Don't have an account?")}{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
            data-cy="register_link"
          >
            {t("sign up")}
          </Link>
        </p>
      </AnimateOnMount>
    </div>
  );
};

LoginForm.displayName = "LoginForm";
export default LoginForm;
