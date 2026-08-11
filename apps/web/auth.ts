// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import GoogleProvider from "next-auth/providers/google";

// backend user-shape (snake_case) → session user-shape (camelCase), zelfde
// mapping als de credentials-login.
interface BackendUser {
  id: string;
  email: string;
  displayName: string;
  img_url: string;
  join_date: string;
  joinNumber: number;
  totalSets: number;
  streak_count: number;
  streak_last_update: string;
  publicRole: "user" | "owner" | "admin";
  verified: boolean;
  stats: { totalsets: number; timeLearned: number; cardsLearned: number };
  lastTen: unknown[];
}

function mapBackendUser(u: BackendUser) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    imgUrl: u.img_url,
    joinDate: u.join_date,
    joinNumber: u.joinNumber,
    totalSets: u.totalSets,
    streakCount: u.streak_count,
    streakLastUpdate: u.streak_last_update,
    publicRole: u.publicRole,
    verified: u.verified,
    stats: u.stats,
    lastTen: u.lastTen,
  };
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const loginResponse = await fetch(
            `${process.env.AUTH_API_URL}/sessions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            },
          );

          if (!loginResponse.ok) return null;

          const { token } = await loginResponse.json();

          const userResponse = await fetch(
            `${process.env.AUTH_API_URL}/users/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!userResponse.ok) return null;

          const user = await userResponse.json();
          return { ...user, accessToken: token };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    // ========================================
    // MICROSOFT (nieuw)
    // ========================================
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/v2.0`,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    // ========================================
    // JWT CALLBACK
    // ========================================
    jwt: async ({ token, user, account, profile, trigger, session }) => {
      // ── Impersonatie ────────────────────────────────────────────────
      // Admin swapt naar een backend-minted token; de admin-identiteit
      // bewaren we in `original` zodat "stop" geen re-login vereist.
      const update = session as
        | {
            impersonate?: { token: string };
            stopImpersonate?: boolean;
            user?: Partial<(typeof token)["user"]>;
          }
        | undefined;

      // Generieke user-update (bv. persoonlijke data uit settings): merge de
      // meegegeven velden in de token-user zodat de session ze bewaart.
      if (trigger === "update" && update?.user) {
        token.user = { ...token.user, ...update.user } as typeof token.user;
        return token;
      }

      if (trigger === "update" && update?.impersonate) {
        // admin-check zit al in de server action + de backend (die enkel voor
        // admins een token mint). We swappen enkel de meegegeven token in.
        const impToken = update.impersonate.token;
        const res = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${impToken}` },
        });
        if (!res.ok) return token;
        const raw = (await res.json()) as BackendUser;
        token.original = { accessToken: token.accessToken, user: token.user };
        token.accessToken = impToken;
        token.user = mapBackendUser(raw) as typeof token.user;
        token.impersonating = true;
        return token;
      }

      if (trigger === "update" && update?.stopImpersonate && token.original) {
        token.accessToken = token.original.accessToken;
        token.user = token.original.user as typeof token.user;
        token.impersonating = false;
        token.original = undefined;
        return token;
      }

      // Check of de backend JWT token verlopen is (enkel als er geen nieuwe login is)
      if (!user && token.accessToken) {
        try {
          const payload = JSON.parse(
            Buffer.from(
              (token.accessToken as string).split(".")[1],
              "base64",
            ).toString(),
          );
          if (Date.now() >= payload.exp * 1000) {
            return { ...token, error: "AccessTokenExpired" as const };
          }
        } catch {
          return { ...token, error: "AccessTokenExpired" as const };
        }
      }

      // Bij CREDENTIALS login (bestaande flow)
      if (user && account?.provider === "credentials") {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id!,
          email: user.email!,
          displayName: user.displayName,
          imgUrl: user.img_url,
          joinDate: user.join_date,
          joinNumber: user.joinNumber,
          totalSets: user.totalSets,
          streakCount: user.streak_count,
          streakLastUpdate: user.streak_last_update,
          publicRole: user.publicRole as "user" | "owner" | "admin",
          verified: user.verified,
          acceptedTerms: user.acceptedTerms,
          acceptedTermsDate: user.acceptedTermsDate,
          privacyVersion: user.privacyVersion,
          stats: user.stats,
          lastTen: user.lastTen,
        };
      }

      // Bij MICROSOFT login (nieuw)
      if (account?.provider === "microsoft-entra-id") {
        try {
          const imgUrl = profile?.picture || "default";

          const res = await fetch(
            `${process.env.AUTH_API_URL}/sessions/social-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                displayName: token.name,
                provider: "microsoft",
                providerId: profile?.sub,
                img_url: imgUrl,
              }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.token;
            token.user = data.user;
          }
        } catch (error) {
          console.error("Microsoft social login error:", error);
        }
      }

      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.AUTH_API_URL}/sessions/social-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                displayName: token.name,
                provider: "google",
                providerId: profile?.sub,
                img_url: profile?.picture || "default",
              }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.token;
            token.user = data.user;
          }
        } catch (error) {
          console.error("Google social login error:", error);
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        error: token.error,
        impersonating: token.impersonating ?? false,
      };
    },
  },
});
