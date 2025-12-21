import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/auth";
import eyeOpened from "../../../public/assets/icons/eye-open.svg";
import eyeClosed from "../../../public/assets/icons/eye-closed.svg";
import google from "../../../public/assets/icons/logos/google.svg";
import microsoft from "../../../public/assets/icons/logos/microsoft.svg";

export default function Form() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
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

  const { handleSubmit, watch, getValues } = methods;

  const validationRules = useMemo(() => ({
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
    displayName: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters"
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      }
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) => {
        return value === getValues("password") || "Passwords do not match";
      }
    },
    role: {
      required: "Please select your role"
    }
  }), [getValues]);

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

  return (
    <div className="w-full flex items-center justify-center">
      <FormProvider {...methods}>
        <form
          className="w-full max-w-md h-fit transition-all z-[999]
            shadow-[4px_4px_12px_#d9e4ee,-4px_-4px_12px_#ffffff] backdrop-blur-xs
            dark:shadow-[4px_4px_12px_#141b24,-4px_-4px_12px_#22303f] overflow-hidden
            duration-500 rounded-2xl sm:rounded-4xl dark:bg-[#182536] bg-white dark:text-white
            flex flex-col justify-center items-center"
          onSubmit={handleSubmit(handleRegister)}
          data-cy="register_form"
        >
          <div className="w-full h-full px-6 sm:px-8 md:px-10 py-8 sm:py-12 md:py-15">
            <div className="w-full flex flex-col gap-3 sm:gap-4">
              <Link to="/welcome"
                    className="w-full h-fit font-akira text-3xl sm:text-4xl text-center text-emerald-400 dark:text-white">
                STUDO
              </Link>
              <div className="w-full overflow-hidden truncate text-center text-sm sm:text-base">
                {t("register new account")}
              </div>

              <div className="w-full h-fit flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13 rounded-full text-sm sm:text-base border-0
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
                  {methods.formState.errors.email && (
                    <span className="text-red-500 text-xs px-4" data-cy="email_error">
                      {methods.formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13 rounded-full text-sm sm:text-base border-0
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
                  {methods.formState.errors.displayName && (
                    <span className="text-red-500 text-xs px-4" data-cy="displayName_error">
                      {methods.formState.errors.displayName.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13 rounded-full text-sm sm:text-base border-0
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
                      className={`w-4 sm:w-5 flex-shrink-0 cursor-pointer dark:invert dark:brightness-0 dark:opacity-50 ${open ? "" : "pt-0.5 sm:pt-1"}`}
                      data-cy="toggle_password_visibility"
                    />
                  </div>
                  {methods.formState.errors.password && (
                    <span className="text-red-500 text-xs px-4" data-cy="password_error">
                      {methods.formState.errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13 rounded-full text-sm sm:text-base border-0
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
                  {methods.formState.errors.confirmPassword && (
                    <span className="text-red-500 text-xs px-4" data-cy="confirmPassword_error">
                      {methods.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <div className="w-full h-fit flex flex-col gap-2">
                  <span className="text-sm sm:text-base">{t("I am a")}</span>
                  <div className="flex flex-col justify-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13 rounded-full text-sm sm:text-base border-0
                    bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                    border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                    dark:text-white">
                    <select
                      {...methods.register("role", validationRules.role)}
                      className="w-full bg-transparent focus:outline-none"
                      data-cy="role_select"
                    >
                      <option value="student">{t("student")}</option>
                      <option value="teacher">{t("teacher")}</option>
                      <option value="professor">{t("professor")}</option>
                    </select>
                  </div>
                  {methods.formState.errors.role && (
                    <span className="text-red-500 text-xs px-4">
                      {methods.formState.errors.role.message}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-xs sm:text-sm text-center" data-cy="register_error">
                  {error.message || "Registration failed. Please try again."}
                </div>
              )}

              <button
                className="w-full mt-5 sm:mt-7 h-11 sm:h-12 md:h-13 border border-solid border-white/50 border-2
                  font-bold flex cursor-pointer justify-center items-center rounded-2xl sm:rounded-4xl text-sm sm:text-base bg-emerald-400
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 active:scale-[0.98] transition-all"
                type="submit"
                disabled={loading}
                data-cy="submit_register"
              >
                {loading ? t("Registering...") : t("Register")}
              </button>

              <div className="w-full h-fit flex flex-col gap-3 sm:gap-5 justify-center items-center">
                <Link to="/login"
                      className="opacity-50 underline text-xs sm:text-sm hover:opacity-70 transition-opacity"
                      data-cy="login_link">
                  {t("log in")}
                </Link>
              </div>

              <div className="w-full h-fit flex-col flex items-center justify-center gap-3 sm:gap-5">
                <p className="text-xs sm:text-sm">{t("or log in with")}</p>
                <div className="w-full h-fit flex items-center justify-center gap-4 sm:gap-5">
                  <button
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    type="button"
                    onClick={loginGoogle}
                    data-cy="register_google"
                  >
                    <img className="h-8 sm:h-9 md:h-10" src={google} alt="google-icon" />
                  </button>
                  <button
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    type="button"
                    onClick={loginMicrosoft}
                    data-cy="register_microsoft"
                  >
                    <img className="h-8 sm:h-9 md:h-10" src={microsoft} alt="microsoft-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}