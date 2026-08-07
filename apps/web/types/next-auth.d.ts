// shared-types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

type PublicRole = "user" | "owner" | "admin";

interface StudoUser {
  id: string;
  email: string;
  displayName: string;
  img_url: string;
  join_date: string;
  joinNumber: number;
  totalSets: number;
  streak_count: number;
  streak_last_update: string;
  publicRole: PublicRole;
  verified: boolean;
  stats: {
    totalsets: number;
    timeLearned: number;
    cardsLearned: number;
  };
  lastTen: unknown[];
}

declare module "next-auth" {
  interface Session {
    user: StudoUser;
    accessToken: string;
    error?: "AccessTokenExpired";
    // true wanneer de huidige sessie een user impersoneert
    impersonating?: boolean;
  }

  interface User extends StudoUser {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: StudoUser;
    error?: "AccessTokenExpired";
    // impersonatie-state (zie auth.ts jwt-callback). `user` bewust los getypeerd
    // (dubbele StudoUser-augmentatie botst anders) — runtime is de sessie-user.
    impersonating?: boolean;
    original?: { accessToken: string; user: unknown };
  }
}
