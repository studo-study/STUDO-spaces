"use client";
import Image from "next/image";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import Link from "next/link";
import { useRegisterForm } from "@/hooks/overige/useRegisterForm";
import InputField from "@/components/ui/design_system/input/InputField";
import InputSelect from "@/components/ui/design_system/select/InputSelect";

export default function MobileForm() {
  const {
    form: {
      register,
      watch,
      setValue,
      formState: { errors, isSubmitting },
    },
    t,
    language,
    showPassword,
    toggleShowPassword,
    serverError,
    onSubmit,
    loginGoogle,
    loginMicrosoft,
    loginSmartschool,
  } = useRegisterForm();
  const roleValue = watch("role");

  const otherRegister = false;

  return (
    <div className={"w-full h-full overflow-y-scroll"}>
      <AnimateOnMount delay={100}>
        <div className="w-screen h-full flex items-center justify-center overflow-scroll scroll-hidden">
          <div
            className={`w-full h-fit flex flex-row overflow-y-scroll transition-all duration-700`}
          >
            <div className="w-full liquid-glass h-fit pt-16 flex flex-col gap-6 justify-center items-center px-12 relative overflow-hidden">
              <div className="h-fit w-full md:w-1/2 justify-center relative gap-6 z-10 flex flex-col">
                <AnimateOnMount delay={200}>
                  <div className="flex flex-col gap-2 transition-all duration-500 delay-200">
                    <h1 className="text-4xl font-bold text-studodarkblue dark:text-white">
                      {t("Create account")}
                    </h1>
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
                      <div className="w-full flex flex-col gap-4 transition-all duration-500 delay-300">
                        <span className="w-full dark:text-white text-studodarkblue text-sm opacity-50">
                          {t("info_title")}
                        </span>

                        {/* Email field */}
                        <div className="flex flex-col gap-1">
                          <InputField
                            variant="cardInput"
                            type="email"
                            placeholder={t("email")}
                            {...register("email")}
                            error={
                              errors.email?.message
                                ? t(errors.email.message)
                                : undefined
                            }
                            data-cy="email_input"
                            autoComplete="off"
                          />
                          {errors.email?.message && (
                            <span className="px-4 text-red-400 text-xs">
                              {t(errors.email.message)}
                            </span>
                          )}
                        </div>

                        {/* Display name field */}
                        <div className="flex flex-col gap-1">
                          <InputField
                            variant="cardInput"
                            placeholder={t("name")}
                            {...register("displayName")}
                            error={
                              errors.displayName?.message
                                ? t(errors.displayName.message)
                                : undefined
                            }
                            data-cy="name_input"
                            autoComplete="off"
                          />
                          {errors.displayName?.message && (
                            <span className="px-4 text-red-400 text-xs">
                              {t(errors.displayName.message)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Password section */}
                      <div className="w-full flex flex-col gap-4 transition-all duration-500 delay-300">
                        <span className="w-full dark:text-white text-studodarkblue text-sm opacity-50">
                          {t("password_title")}
                        </span>

                        {/* Password field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <InputField
                              variant="cardInput"
                              type={showPassword ? "text" : "password"}
                              placeholder={t("password")}
                              {...register("password")}
                              error={
                                errors.password?.message
                                  ? t(errors.password.message)
                                  : undefined
                              }
                              data-cy="password_input"
                              autoComplete="off"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={toggleShowPassword}
                              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-50 hover:opacity-80 transition-opacity"
                              data-cy="toggle_password_visibility"
                            >
                              <Image
                                src={
                                  showPassword
                                    ? "/icons/eye-open.svg"
                                    : "/icons/eye-closed.svg"
                                }
                                width={20}
                                height={20}
                                alt="Toggle password visibility"
                                className="w-4 sm:w-5 dark:invert dark:brightness-0"
                              />
                            </button>
                          </div>
                          {errors.password?.message && (
                            <span className="px-4 text-red-400 text-xs">
                              {t(errors.password.message)}
                            </span>
                          )}
                        </div>

                        {/* Confirm password field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <InputField
                              variant="cardInput"
                              type={showPassword ? "text" : "password"}
                              placeholder={t("repeat password")}
                              {...register("confirmPassword")}
                              error={
                                errors.confirmPassword?.message
                                  ? t(errors.confirmPassword.message)
                                  : undefined
                              }
                              data-cy="confirm_password_input"
                              autoComplete="off"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={toggleShowPassword}
                              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-50 hover:opacity-80 transition-opacity"
                              data-cy="toggle_password_visibility"
                            >
                              <Image
                                src={
                                  showPassword
                                    ? "/icons/eye-open.svg"
                                    : "/icons/eye-closed.svg"
                                }
                                width={20}
                                height={20}
                                alt="Toggle password visibility"
                                className="w-4 sm:w-5 dark:invert dark:brightness-0"
                              />
                            </button>
                          </div>
                          {errors.confirmPassword?.message && (
                            <span className="px-4 text-red-400 text-xs">
                              {t(errors.confirmPassword.message)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role section */}
                      <div className="w-full flex flex-col gap-4 transition-all duration-500 delay-300">
                        <span className="w-full dark:text-white text-studodarkblue text-sm opacity-50">
                          {t("role_title")}
                        </span>
                        <InputSelect
                          options={[
                            { value: "student", label: t("student") },
                            { value: "teacher", label: t("teacher") },
                            { value: "professor", label: t("professor") },
                          ]}
                          value={roleValue}
                          onChange={(value) =>
                            setValue("role", value as string)
                          }
                          dataCy="role_select"
                          size="lg"
                        />
                        {errors.role?.message && (
                          <span className="px-4 text-red-400 text-xs">
                            {t(errors.role.message)}
                          </span>
                        )}
                      </div>
                    </div>
                  </AnimateOnMount>

                  {/* Server error message */}
                  <div className="px-4 min-h-5">
                    {serverError && (
                      <div
                        className="rounded-xl text-red-400 text-sm"
                        data-cy="register_error"
                      >
                        {t(serverError)}
                      </div>
                    )}
                  </div>

                  <AnimateOnMount delay={400}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full h-13 mt-2 rounded-full font-semibold text-white
                                    bg-emerald-400
                                    hover:bg-emerald-500
                                    active:scale-[0.98] cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    shadow-lg shadow-emerald-500/25
                                    transition-all duration-500 delay-400`}
                      data-cy="submit_login"
                    >
                      {isSubmitting ? t("Loading") : t("Register")}
                    </button>
                  </AnimateOnMount>
                </form>

                {otherRegister && (
                  <AnimateOnMount delay={400}>
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
                          className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                            bg-studodarkblue/5 border-studodarkblue/5
                                            dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                            transition-all duration-300 cursor-pointer"
                          data-cy="login_google"
                        >
                          <Image
                            src="/icons/logos/google.svg"
                            width={24}
                            height={24}
                            alt="Google"
                            className="h-6"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={loginMicrosoft}
                          className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                            bg-studodarkblue/5 border-studodarkblue/5
                                            dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                            transition-all duration-300 cursor-pointer"
                          data-cy="login_microsoft"
                        >
                          <Image
                            src="/icons/logos/microsoft.svg"
                            width={24}
                            height={24}
                            alt="Microsoft"
                            className="h-6"
                          />
                        </button>
                        {(language === "nl" || language === "fr-BE") && (
                          <button
                            type="button"
                            onClick={loginSmartschool}
                            className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                              bg-studodarkblue/5 border-studodarkblue/5
                                              dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                              transition-all duration-300 cursor-pointer"
                            data-cy="login_smartschool"
                          >
                            <Image
                              src="/icons/logos/smartschool.png"
                              width={24}
                              height={24}
                              alt="Smartschool"
                              className="h-6"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </AnimateOnMount>
                )}

                <AnimateOnMount delay={500}>
                  <p className="text-center text-sm text-slate-500 transition-all duration-500 delay-600">
                    {t("Already")}{" "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      data-cy="register_link"
                    >
                      {t("log in")}
                    </Link>
                  </p>
                </AnimateOnMount>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnMount>
    </div>
  );
}
