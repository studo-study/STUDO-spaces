"use client"
import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import {StudoUser} from "@/types/types";

interface UserContextType {
    user: StudoUser | null;
    isLoading: boolean;
    isModerator: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, isLoading: true, isModerator: false });

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    const user = session?.user ?? null;
    const isModerator = user?.verified && ["owner", "moderator"].includes(user.publicRole) || false;

    return (
        <UserContext.Provider value={{
            user,
            isLoading: status === "loading",
            isModerator
        }}>
            {children}
        </UserContext.Provider>
    );
}


export const useUser = () => useContext(UserContext);