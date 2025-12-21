import {
  useState,
  useCallback,
  useMemo
} from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import * as api from "../api";
import { AuthContext, JWT_TOKEN_KEY } from "./auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));


  const {
    data: user,
    isLoading: userLoading,
    error: userError
  } = useSWR(token ? "users/me" : null, api.getById);


  const {
    trigger: doLogin,
    isMutating: loginLoading,
    error: loginError
  } = useSWRMutation("sessions", api.save);


  const {
    trigger: doRegister,
    isMutating: registerLoading,
    error: registerError
  } = useSWRMutation("users", api.save);


  const login = useCallback(
    async (email, password) => {
      try {
        const { token } = await doLogin({
          email,
          password
        });

        setToken(token);
        localStorage.setItem(JWT_TOKEN_KEY, token);

        return true;
      } catch (error) {

        return false;
      }
    },
    [doLogin]
  );


  const register = useCallback(
    async (email, displayName, password, role) => {
      try {
        const { token } = await doRegister({
          email,
          displayName,
          password,
          role
        });


        setToken(token);
        localStorage.setItem(JWT_TOKEN_KEY, token);

        return true;
      } catch (error) {
        return false;
      }
    },
    [doRegister]
  );


  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem("refreshToken");
  }, []);


  const value = useMemo(
    () => ({
      token,
      user,
      error: loginError || userError || registerError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: Boolean(token),
      ready: !userLoading,
      login,
      register,
      logout
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
      logout
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};