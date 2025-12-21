import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import eyeOpened from "../../../public/assets/icons/eye-open.svg";
import eyeClosed from "../../../public/assets/icons/eye-closed.svg";
import google from "../../../public/assets/icons/logos/google.svg";
import microsoft from "../../../public/assets/icons/logos/microsoft.svg";

const validationRules = {
  email: {
    required: "Email is required"
  },
  password: {
    required: "Password is required"
  }
};

export default function Form() {
  const { search } = useLocation();
  const [open, setOpen] = useState(false);
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({});
  const { handleSubmit } = methods;
  const { t } = useTranslation();

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);

      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get("redirect") || "/home",
          replace: true
        });
      }
    },
    [login, navigate, search]
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
          className="w-full max-w-md h-fit transition-all z-[9999]
            shadow-[4px_4px_12px_#d9e4ee,-4px_-4px_12px_#ffffff] backdrop-blur-xs
            dark:shadow-[4px_4px_12px_#141b24,-4px_-4px_12px_#22303f] overflow-hidden
            duration-500 rounded-2xl sm:rounded-4xl dark:bg-[#182536] bg-white dark:text-white
            flex flex-col justify-center items-center"
          onSubmit={handleSubmit(handleLogin)}
          data-cy="login_form">
          <div className="w-full h-full px-6 sm:px-8 md:px-10 py-8 sm:py-12 md:py-15">
            <div className="w-full flex flex-col gap-3 sm:gap-4">
              <Link
                to="/welcome"
                className="w-full h-fit font-akira text-3xl sm:text-4xl text-emerald-400 dark:text-white text-center">
                STUDO
              </Link>
              <div className="w-full overflow-hidden truncate text-center text-sm sm:text-base">
                {t("log into account")}
              </div>
              <div className="w-full h-fit flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                  rounded-full text-sm sm:text-base border-0
                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                  dark:text-white">
                  <input
                    {...methods.register("email", validationRules.email)}
                    type="text"
                    placeholder={t("email")}
                    autoComplete="none"
                    className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                    data-cy="email_input"
                  />
                </div>
                <div className="flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                  rounded-full text-sm sm:text-base border-0
                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                  dark:text-white overflow-hidden gap-2">
                  <input
                    type={open ? "text" : "password"}
                    placeholder={t("password")}
                    autoComplete="none"
                    {...methods.register("password", validationRules.password)}
                    className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
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
              </div>
              {error && (
                <div className="text-red-500 text-xs sm:text-sm" data-cy="login_error">
                  {error.message}
                </div>
              )}
              <button
                className="w-full mt-5 sm:mt-7 h-11 sm:h-12 md:h-13 flex cursor-pointer justify-center items-center
                  rounded-2xl sm:rounded-4xl text-sm sm:text-base
                  border border-solid border-studogrey border-2 bg-blue-400 text-white font-medium
                  hover:bg-blue-500 active:scale-[0.98] transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
                data-cy="submit_login">
                {loading ? t("Loading...") : t("Log In")}
              </button>
              <div className="w-full h-fit flex flex-col gap-3 sm:gap-5 justify-center items-center">
                <Link
                  to="/register"
                  className="opacity-50 underline text-xs sm:text-sm hover:opacity-70 transition-opacity"
                  data-cy="register_link">
                  {t("sign up")}
                </Link>
              </div>
              <div className="w-full h-fit flex-col flex items-center justify-center gap-3 sm:gap-5">
                <p className="text-xs sm:text-sm">{t("or log in with")}</p>
                <div className="w-full h-fit flex items-center justify-center gap-4 sm:gap-5">
                  <button
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    type="button"
                    onClick={loginGoogle}
                    data-cy="login_google">
                    <img className="h-8 sm:h-9 md:h-10" src={google} alt="google-icon" />
                  </button>
                  <button
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    type="button"
                    onClick={loginMicrosoft}
                    data-cy="login_microsoft">
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