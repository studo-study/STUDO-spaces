"use client";
import InputField from "@studo/ui/design_system/input/InputField";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import Link from "next/link";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import GoogleIcon from "@/components/ui/overige/icons/companies/Google";
import MicrosoftIcon from "@/components/ui/overige/icons/companies/Microsoft";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { useRegisterForm } from "@/hooks/overige/useRegisterForm";
import Check from "@studo/ui/design_system/input/Check";

const RegisterForm = () => {
  const {
    form: {
      register,
      watch,
      setValue,
      formState: { isSubmitting },
    },
    t,
    showPassword: open,
    toggleShowPassword: toggleShow,
    onSubmit,
    loginGoogle,
    loginMicrosoft,
  } = useRegisterForm();

  const acceptedTerms = watch("acceptedTerms");

  return (
    <form
      data-cy="login_form"
      onSubmit={onSubmit}
      className={
        "min-w-0 max-w-100 min-h-0 h-fit flex-1 flex flex-col items-center justify-center dark:text-white text-studodarkblue"
      }
    >
      <AnimateOnMount>
        <div className={"mb-10 flex min-w-full flex-col items-center"}>
          <h1 className="text-4xl font-medium">{t("Create account")}</h1>
          <p className="text-slate-400 text-sm">{t("create_account")}</p>
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={200} className={"min-w-full"}>
        <div className={"max-h-fit w-full gap-5 flex flex-col mb-5"}>
          <InputField
            label={t("info_title")}
            className="min-h-12 items-center"
            variant="cardInput"
            type="email"
            autoComplete="off"
            placeholder={t("email")}
            {...register("email")}
          />
          <InputField
            className="min-h-12 mb-5 items-center"
            variant="cardInput"
            type="text"
            autoComplete="off"
            placeholder={t("name")}
            {...register("displayName")}
          />
          <InputField
            iconRight={
              <BaseButton
                variant={"ghost"}
                size={"sm"}
                shape={"square"}
                type={"button"}
                onClick={toggleShow}
                icon={open ? <EyeClosed size={20} /> : <Eye size={20} />}
              />
            }
            label={t("password_title")}
            className="min-h-12 items-center"
            variant="cardInput"
            type={open ? "text" : "password"}
            autoComplete="off"
            placeholder={t("password")}
            {...register("password")}
          />
          <InputField
            iconRight={
              <BaseButton
                variant={"ghost"}
                size={"sm"}
                shape={"square"}
                type={"button"}
                onClick={toggleShow}
                icon={open ? <EyeClosed size={20} /> : <Eye size={20} />}
              />
            }
            type={open ? "text" : "password"}
            className="min-h-12 items-center"
            variant="cardInput"
            autoComplete="off"
            placeholder={t("repeat password")}
            {...register("confirmPassword")}
          />
          <div className={"flex flex-row gap-2 items-start"}>
            <div className={"pt-0.5"}>
              <Check
                checked={!!acceptedTerms}
                onChange={(check) =>
                  setValue("acceptedTerms", check, { shouldValidate: true })
                }
              />
            </div>
            <span
              className={
                "flex flex-row flex-wrap gap-1 text-sm text-neutral-400 dark:text-studogrey"
              }
            >
              {t("tos")}
              <Link
                href={"/terms-of-service"}
                target="_blank"
                className={"underline"}
              >
                {t("terms")}
              </Link>
              {t("and")}
              <Link href={"/privacy"} target="_blank" className={"underline"}>
                {t("privacy")}
              </Link>
            </span>
          </div>
          <div className={"max-h-10 my-5"}>
            <BaseButton
              disabled={!acceptedTerms || isSubmitting}
              variant={"approve"}
              type={"submit"}
              iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
              className={"min-w-full"}
              label={isSubmitting ? t("Loading") : t("Register")}
            />
          </div>
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={400}>
        <p className="text-center text-sm text-slate-500 transition-all duration-500 delay-600">
          {t("Already")}{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            data-cy="login_link"
          >
            {t("log in")}
          </Link>
        </p>
      </AnimateOnMount>

      <AnimateOnMount delay={600} className={"min-w-full"}>
        <div
          className={
            "h-fit my-8 max-w-100 min-w-full flex flex-row items-center justify-center gap-3"
          }
        >
          <hr className={"min-w-0 flex-1 h-px bg-studogrey/30 border-none"} />
          <span className="min-w-fit text-xs text-slate-500">
            {t("other_register")}
          </span>
          <hr className={"min-w-0 flex-1 h-px bg-studogrey/30 border-none"} />
        </div>
      </AnimateOnMount>

      <AnimateOnMount delay={800} className={"min-w-full"}>
        <div
          className={
            "max-h-fit w-full items-center justify-center gap-5 flex flex-row"
          }
        >
          <BaseButton
            onClick={loginGoogle}
            type={"button"}
            variant={"outline_link"}
            className={"min-h-12 gap-5 flex flex-row font-medium text-base"}
          >
            <GoogleIcon size={20} />
          </BaseButton>
          <BaseButton
            onClick={loginMicrosoft}
            variant={"outline_link"}
            type={"button"}
            className={"min-h-12 gap-5 flex flex-row"}
          >
            <MicrosoftIcon size={20} />
          </BaseButton>
        </div>
      </AnimateOnMount>
    </form>
  );
};

RegisterForm.displayName = "RegisterForm";
export default RegisterForm;
