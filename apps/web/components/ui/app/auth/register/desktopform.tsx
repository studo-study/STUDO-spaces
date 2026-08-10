"use client";
import Image from "next/image";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useRegisterForm } from "@/hooks/overige/useRegisterForm";
import InputField from "@/components/ui/design_system/input/InputField";
import Select from "@/components/ui/design_system/select/Select";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

export default function DesktopForm() {
  const {
    form: {
      register,
      control,
      formState: { isSubmitting },
    },
    t,
    language,
    showPassword: open,
    toggleShowPassword: toggleShow,
    onSubmit,
    loginGoogle,
    loginMicrosoft,
    loginSmartschool,
  } = useRegisterForm();
  const otherOptions = false;
  return (
    <div className="w-full dark:text-white text-studodarkblue  h-full 3xl:absolute 3xl:inset-0 3xl:flex 3xl:justify-center 3xl:items-center flex justify-end">
      <AnimateOnMount delay={100}>
        <div
          className={`w-3/5 xl:w-full h-full flex flex-row overflow-hidden
                    rounded-4xl 3xl:h-fit 3xl:max-w-full 
                    shadow-2xl shadow-black/20
                    transition-all duration-700`}
        >
          <div className="w-full backdrop-blur-2xl flex flex-col gap-10 justify-center px-12 py-15 relative overflow-hidden overflow-y-scroll scroll-hidden">
            <div className="h-full justify-baseline relative gap-8 z-10 flex flex-col">
              <AnimateOnMount delay={200}>
                <div className="flex flex-col gap-2 transition-all duration-500 delay-200">
                  <h1 className="text-4xl font-bold">{t("Create account")}</h1>
                  <p className="text-slate-400 text-sm">
                    {t("create_account")}
                  </p>
                </div>
              </AnimateOnMount>

              <form
                data-cy="login_form"
                onSubmit={onSubmit}
                className="flex flex-col gap-4"
              >
                <AnimateOnMount delay={300}>
                  <div className="flex flex-col gap-5 transition-all duration-500 delay-300">
                    {/* Info section */}
                    <div className="w-full flex flex-col gap-2 transition-all duration-500 delay-300">
                      <span className="w-full text-sm opacity-50">
                        {t("info_title")}
                      </span>

                      <div className="flex flex-col gap-4">
                        <InputField
                          type="email"
                          placeholder={t("email")}
                          autoComplete="none"
                          {...register("email")}
                          className="min-h-10"
                          data-cy="email_input"
                          variant={"cardInput"}
                          textSize={"base"}
                        />

                        <InputField
                          type="text"
                          placeholder={t("name")}
                          {...register("displayName")}
                          autoComplete="none"
                          data-cy="name_input"
                          variant={"cardInput"}
                        />
                      </div>
                    </div>

                    {/* Password section */}
                    <div className="w-full flex flex-col gap-2 transition-all duration-500 delay-300">
                      <span className="w-full text-sm opacity-50">
                        {t("password_title")}
                      </span>

                      <div className="flex flex-col gap-4">
                        <InputField
                          type={open ? "text" : "password"}
                          placeholder={t("password")}
                          autoComplete="none"
                          {...register("password")}
                          data-cy="password_input"
                          variant={"cardInput"}
                        />

                        <InputField
                          type={open ? "text" : "password"}
                          placeholder={t("repeat password")}
                          autoComplete="none"
                          {...register("confirmPassword")}
                          variant={"cardInput"}
                          data-cy="confirm_password_input"
                        />
                      </div>
                    </div>

                    {/* Role section */}
                    <div className="w-full flex flex-col gap-4 transition-all duration-500 delay-300">
                      <span className="w-full text-sm opacity-50">
                        {t("role_title")}
                      </span>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Select
                            data-cy="role_select"
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: "student", label: t("student") },
                              { value: "teacher", label: t("teacher") },
                              { value: "professor", label: t("professor") },
                            ]}
                          />
                        )}
                      />
                    </div>
                  </div>
                </AnimateOnMount>
                <AnimateOnMount delay={400}>
                  <BaseButton
                    type="submit"
                    disabled={isSubmitting}
                    data-cy="submit_register"
                  >
                    {isSubmitting ? t("Loading") : t("Register")}
                  </BaseButton>
                </AnimateOnMount>
              </form>
              {otherOptions && (
                <AnimateOnMount delay={500}>
                  <div className="flex flex-col gap-4 transition-all duration-500 delay-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-slate-500">
                        {t("other_register")}
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <div className="flex gap-3 flex-row">
                      <button
                        type="button"
                        onClick={loginGoogle}
                        className="flex-1 min-h-13 min-w-13 w-13 flex items-center justify-center gap-2 rounded-full
                                                bg-studodarkblue/5 border-studodarkblue/5 dark:bg-white/5 border dark:border-white/10
                                                dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 cursor-pointer"
                        data-cy="register_google"
                      >
                        <Image
                          src="/icons/logos/google.svg"
                          alt="Google"
                          width={24}
                          height={24}
                          className="h-6"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={loginMicrosoft}
                        className="flex-1 min-h-13 min-w-13 w-13 flex items-center justify-center gap-2 rounded-full
                                                bg-studodarkblue/5 border-studodarkblue/5 dark:bg-white/5 border dark:border-white/10
                                                dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 cursor-pointer"
                        data-cy="register_microsoft"
                      >
                        <Image
                          src="/icons/logos/microsoft.svg"
                          alt="Microsoft"
                          width={24}
                          height={24}
                          className="h-6"
                        />
                      </button>
                      {(language === "nl" || language === "fr-BE") && (
                        <button
                          type="button"
                          onClick={loginSmartschool}
                          className="flex-1 min-h-13 min-w-13 w-13 flex items-center justify-center gap-2 rounded-full
                                                    bg-studodarkblue/5 border-studodarkblue/5 dark:bg-white/5 border dark:border-white/10
                                                    dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 cursor-pointer"
                          data-cy="register_smartschool"
                        >
                          <Image
                            src="/icons/logos/smartschool.png"
                            alt="Smartschool"
                            width={24}
                            height={24}
                            className="h-6"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </AnimateOnMount>
              )}

              <AnimateOnMount delay={600}>
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
            </div>
          </div>
        </div>
      </AnimateOnMount>
    </div>
  );
}
