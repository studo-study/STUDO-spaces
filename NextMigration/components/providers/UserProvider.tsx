"use client"
import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface User {
    displayName: string;
    email: string;
    id: string;
    img_url: string;
    joinNumber: number;
    join_date: string;
    lastTen: studyset[];
    publicRole:string;
    stats: {
        totalsets: number;
        timeLearned: number;
        cardsLearned: number;
    };
    streak_count: number;
    streak_last_update: string;
    totalSets: number;
    verified: boolean;
}

interface studyset {
    "set_id": string;
    "last_studied": string;
    "title": string;
    "Course": string;
    "type": string;
    "progress": number;
    "length": number
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, isLoading: true });

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    return (
        <UserContext.Provider value={{
            user: session?.user ?? null,
            isLoading: status === "loading"
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);