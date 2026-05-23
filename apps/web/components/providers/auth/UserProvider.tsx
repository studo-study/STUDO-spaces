"use client";
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { StudoUser } from "@/types/types";

interface UserContextType {
  user: StudoUser | null;
  isLoading: boolean;
  isModerator: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isModerator: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      (session as { error?: string } | null)?.error === "AccessTokenExpired"
    ) {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  const user = session?.user ?? null;
  const isModerator =
    (user?.verified && ["owner", "moderator"].includes(user.publicRole)) ||
    false;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        isModerator,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
