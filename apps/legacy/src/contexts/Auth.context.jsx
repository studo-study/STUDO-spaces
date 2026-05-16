import { useState, useCallback, useMemo } from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import * as api from "../api";
import { AuthContext, JWT_TOKEN_KEY } from "./auth";
import { useTranslation } from "react-i18next";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [loginError, setLoginError] = useState(null); // eigen error state
  const { t } = useTranslation();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useSWR(token ? "users/me" : null, api.getById);

  const { trigger: doLogin, isMutating: loginLoading } = useSWRMutation(
    "sessions",
    api.save,
  );

  const {
    trigger: doRegister,
    isMutating: registerLoading,
    error: registerError,
  } = useSWRMutation("users", api.save);

  const login = useCallback(
    async (email, password) => {
      try {
        setLoginError(null);
        const { token } = await doLogin({
          email,
          password,
        });

        setToken(token);
        localStorage.setItem(JWT_TOKEN_KEY, token);

        return true;
      } catch (error) {
        // Maak een gebruiksvriendelijke foutmelding
        let message = t("Something went wrong. Try again.");

        if (error.response?.status === 401) {
          message = t("errormessages.log.first");
        } else if (error.response?.status === 429) {
          message = "errormessages.log.sec";
        } else if (!error.response) {
          message = "errormessages.log.else";
        }

        setLoginError({ message });
        return false;
      }
    },
    [doLogin],
  );

  const register = useCallback(
    async (email, displayName, password, role) => {
      try {
        const { token } = await doRegister({
          email,
          displayName,
          password,
          role,
        });

        setToken(token);
        localStorage.setItem(JWT_TOKEN_KEY, token);

        return true;
      } catch (error) {
        return false;
      }
    },
    [doRegister],
  );

  const logout = useCallback(() => {
    setToken(null);
    setLoginError(null); // clear error bij logout
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem("refreshToken");
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      error: loginError || userError || registerError,
      loading: loginLoading || registerLoading,
      userLoading,
      isAuthed: Boolean(token),
      ready: Boolean(token) || !userLoading,
      login,
      register,
      logout,
    }),
    [
      token,
      user,
      loginError,
      loginLoading,
      userError,
      userLoading,
      registerError,
      registerLoading,
      login,
      register,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
