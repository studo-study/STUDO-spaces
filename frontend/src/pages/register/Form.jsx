import { Link, useNavigate } from "react-router-dom";
import {useCallback, useState, useMemo, useEffect} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/auth";
import eyeOpened from "../../assets/icons/eye-open.svg";
import eyeClosed from "../../assets/icons/eye-closed.svg";
import google from "../../assets/icons/logos/google.svg";
import microsoft from "../../assets/icons/logos/microsoft.svg";
import smartschool from "../../assets/icons/logos/smartschool.png";
import i18n from "i18next";

export default function Form() {
  const language = i18n.language;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { error, loading, register: registerUser } = useAuth();

  const methods = useForm({
    defaultValues: {
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
      role: "student"
    }
  });

  const { handleSubmit, getValues, formState: { errors } } = methods;

  useEffect(() => {
    setMounted(true);
  }, []);

  const validationRules = useMemo(() => ({
    email: {
      required: t("validation.email.required", "E-mailadres is verplicht"),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t("validation.email.invalid", "Ongeldig e-mailadres")
      }
    },
    displayName: {
      required: t("validation.name.required", "Naam is verplicht"),
      minLength: {
        value: 2,
        message: t("validation.name.minLength", "Naam moet minstens 2 karakters bevatten")
      }
    },
    password: {
      required: t("validation.password.required", "Wachtwoord is verplicht"),
      minLength: {
        value: 8,
        message: t("validation.password.minLength", "Wachtwoord moet minstens 8 karakters bevatten")
      }
    },
    confirmPassword: {
      required: t("validation.confirmPassword.required", "Bevestig je wachtwoord"),
      validate: (value) => {
        return value === getValues("password") || t("validation.confirmPassword.mismatch", "Wachtwoorden komen niet overeen");
      }
    },
    role: {
      required: t("validation.role.required", "Selecteer je rol")
    }
  }), [getValues, t]);

  const handleRegister = useCallback(
    async ({ email, displayName, password, role }) => {
      const registered = await registerUser(email, displayName, password, role);

      if (registered) {
        navigate("/home", { replace: true });
      }
    },
    [registerUser, navigate]
  );

  const toggleShow = () => {
    setOpen(!open);
  };

  const loginGoogle = useCallback(() => {
    window.location.href = "http://localhost:3000/api/sessions/google";
  }, []);

  const loginMicrosoft = useCallback(() => {
    window.location.href = "http://localhost:3000/api/sessions/microsoft";
  }, []);

  const loginSmartschool = useCallback(() => {
    window.location.href = "http://localhost:3000/api/sessions/smartschool";
  }, []);

  return (
    <div className="w-screen h-screen flex items-center pt-10 justify-center overflow-hidden">
      <FormProvider {...methods}>
        <div className={`w-full h-full flex flex-row
          transition-all duration-700
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

          <div className="w-full h-full backdrop-blur-2xl flex flex-col overflow-y-auto">

            <div className="w-full flex-1 flex flex-col items-center justify-start sm:justify-center px-12 py-8 sm:py-16">

              <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-6">

                <div className={`flex flex-col gap-2 transition-all duration-500 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                  <h1 className="text-3xl sm:text-4xl font-bold text-studodarkblue dark:text-white">{t("Create account")}</h1>
                  <p className="text-slate-400 text-sm">{t("register new account")}</p>
                </div>

                <form onSubmit={handleSubmit(handleRegister)} data-cy="register_form" className="flex flex-col gap-2 sm:gap-3">
                  <div className={`flex flex-col gap-2 sm:gap-3 transition-all duration-500 delay-300
                    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>

                    {/* Email Input */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                        rounded-full text-sm sm:text-base border-0
                        bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                        border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                        dark:text-white">
                        <input
                          type="email"
                          placeholder={t("email")}
                          autoComplete="email"
                          {...methods.register("email", validationRules.email)}
                          className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                          data-cy="email_input"
                        />
                      </div>
                      <span className="text-red-400 h-4 sm:h-5 text-xs px-4" data-cy="email_error">
                        {errors.email?.message}
                      </span>
                    </div>

                    {/* Display Name Input */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                        rounded-full text-sm sm:text-base border-0
                        bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                        border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                        dark:text-white">
                        <input
                          type="text"
                          placeholder={t("name")}
                          autoComplete="name"
                          {...methods.register("displayName", validationRules.displayName)}
                          className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                          data-cy="displayName_input"
                        />
                      </div>
                      <span className="text-red-400 h-4 sm:h-5 text-xs px-4" data-cy="displayName_error">
                        {errors.displayName?.message}
                      </span>
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                        rounded-full text-sm sm:text-base border-0
                        bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                        border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                        dark:text-white overflow-hidden gap-2">
                        <input
                          type={open ? "text" : "password"}
                          placeholder={t("password")}
                          autoComplete="new-password"
                          {...methods.register("password", validationRules.password)}
                          className="transition-all w-full duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
                          data-cy="password_input"
                        />
                        <img
                          src={open ? eyeOpened : eyeClosed}
                          onClick={toggleShow}
                          className={`w-4 sm:w-5 flex-shrink-0 cursor-pointer dark:invert dark:brightness-0 dark:opacity-50 ${
                            open ? "" : "pt-0.5 sm:pt-1"
                          }`}
                          data-cy="toggle_password_visibility"
                        />
                      </div>
                      <span className="text-red-400 h-4 sm:h-5 text-xs px-4" data-cy="password_error">
                        {errors.password?.message}
                      </span>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                        rounded-full text-sm sm:text-base border-0
                        bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                        border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                        dark:text-white">
                        <input
                          type={open ? "text" : "password"}
                          placeholder={t("confirm password")}
                          autoComplete="new-password"
                          {...methods.register("confirmPassword", validationRules.confirmPassword)}
                          className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                          data-cy="confirmPassword_input"
                        />
                      </div>
                      <span className="text-red-400 h-4 sm:h-5 text-xs px-4" data-cy="confirmPassword_error">
                        {errors.confirmPassword?.message}
                      </span>
                    </div>

                    {/* Role Select */}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-400 px-2">{t("I am a")}</span>
                      <div className="flex flex-col justify-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                        rounded-full text-sm sm:text-base border-0
                        bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                        border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                        dark:text-white">
                        <select
                          {...methods.register("role", validationRules.role)}
                          className="w-full bg-transparent focus:outline-none"
                          data-cy="role_select"
                        >
                          <option value="student" className="bg-slate-800">{t("student")}</option>
                          <option value="teacher" className="bg-slate-800">{t("teacher")}</option>
                          <option value="professor" className="bg-slate-800">{t("professor")}</option>
                        </select>
                      </div>
                      <span className="text-red-400 h-4 sm:h-5 text-xs px-4">
                        {errors.role?.message}
                      </span>
                    </div>
                  </div>

                  <span className="text-red-400 h-5 text-sm px-4" data-cy="register_error">
                    {error?.message}
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 sm:h-13 rounded-full font-semibold text-white
                      bg-gradient-to-r from-emerald-500 to-emerald-400
                      hover:from-emerald-600 hover:to-emerald-500
                      active:scale-[0.98] cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-lg shadow-emerald-500/25
                      transition-all duration-500 delay-400
                      ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                    data-cy="submit_register"
                  >
                    {loading ? t("Registering...") : t("Register")}
                  </button>
                </form>

                <div className={`flex flex-col gap-3 sm:gap-4 transition-all duration-500 delay-500
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-slate-500">{t("or sign up with")}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div className="flex gap-3 flex-row">
                    <button
                      type="button"
                      onClick={loginGoogle}
                      className="flex-1 min-h-12 sm:min-h-13 min-w-12 sm:min-w-13 flex items-center justify-center gap-2 rounded-full
                        bg-studodarkblue/5 border-studodarkblue/5
                        dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                        transition-all duration-300 cursor-pointer"
                      data-cy="register_google"
                    >
                      <img src={google} alt="" className="h-5 sm:h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={loginMicrosoft}
                      className="flex-1 min-h-12 sm:min-h-13 min-w-12 sm:min-w-13 flex items-center justify-center gap-2 rounded-full
                        bg-studodarkblue/5 border-studodarkblue/5
                        dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                        transition-all duration-300 cursor-pointer"
                      data-cy="register_microsoft"
                    >
                      <img src={microsoft} alt="" className="h-5 sm:h-6" />
                    </button>
                    {(language === "nl" || language === "fr-BE") && (
                      <button
                        type="button"
                        onClick={loginSmartschool}
                        className="flex-1 min-h-12 sm:min-h-13 min-w-12 sm:min-w-13 flex items-center justify-center gap-2 rounded-full
                          bg-studodarkblue/5 border-studodarkblue/5
                          dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                          transition-all duration-300 cursor-pointer"
                        data-cy="register_smartschool"
                      >
                        <img src={smartschool} alt="" className="h-5 sm:h-6" />
                      </button>
                    )}
                  </div>
                </div>

                <p className={`text-center text-sm text-slate-500 transition-all duration-500 delay-600
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                  {t("Already have an account?")}{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors" data-cy="login_link">
                    {t("log in")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}