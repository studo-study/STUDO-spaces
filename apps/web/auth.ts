// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import GoogleProvider from "next-auth/providers/google";

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({

    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                try {
                    const loginResponse = await fetch(`${process.env.AUTH_API_URL}/sessions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!loginResponse.ok) return null;

                    const { token } = await loginResponse.json();

                    const userResponse = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (!userResponse.ok) return null;

                    const user = await userResponse.json();
                    return { ...user, accessToken: token };

                } catch (error) {
                    console.error('Auth error:', error);
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
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },

    callbacks: {
        // ========================================
        // JWT CALLBACK
        // ========================================
        jwt: async ({ token, user, account, profile }) => {
            console.log('🔍 JWT callback:', {
                hasUser: !!user,
                provider: account?.provider,
                tokenEmail: token.email,
                tokenName: token.name,
                profile: profile,
            });

            // Bij CREDENTIALS login (bestaande flow)
            if (user && account?.provider === 'credentials') {
                token.accessToken = user.accessToken;
                token.user = {
                    id: user.id!,
                    email: user.email!,
                    displayName: user.displayName,
                    img_url: user.img_url,
                    join_date: user.join_date,
                    joinNumber: user.joinNumber,
                    totalSets: user.totalSets,
                    streak_count: user.streak_count,
                    streak_last_update: user.streak_last_update,
                    publicRole: user.publicRole as "user" | "owner" | "admin",
                    verified: user.verified,
                    stats: user.stats,
                    lastTen: user.lastTen,
                };
            }

            // Bij MICROSOFT login (nieuw)
            if (account?.provider === 'microsoft-entra-id') {
                try {
                    let imgUrl = "default";
                    try {
                        const photoRes = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
                            headers: { 'Authorization': `Bearer ${account.access_token}` },
                        });
                        if (photoRes.ok) {
                            const buffer = await photoRes.arrayBuffer();
                            imgUrl = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
                        }
                    } catch {}

                    const res = await fetch(`${process.env.AUTH_API_URL}/sessions/social-login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: token.email,
                            displayName: token.name,
                            provider: 'microsoft',
                            providerId: profile?.sub,
                            img_url: imgUrl,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        token.accessToken = data.token;
                        token.user = data.user;
                    }
                } catch (error) {
                    console.error('Microsoft social login error:', error);
                }
            }

            if (account?.provider === 'google') {
                console.log('🔍 Google profile:', JSON.stringify(profile));
                console.log('🔍 Google token:', JSON.stringify(token));
                try {
                    const res = await fetch(`${process.env.AUTH_API_URL}/sessions/social-login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: token.email,
                            displayName: token.name,
                            provider: 'google',
                            providerId: profile?.sub,
                            img_url: profile?.picture || "default",
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        token.accessToken = data.token;
                        token.user = data.user;
                    }
                } catch (error) {
                    console.error('Google social login error:', error);
                }
            }



            return token;
        },

        session: async ({ session, token }) => {
            return {
                ...session,
                user: token.user,
                accessToken: token.accessToken,
            };
        },
    },
});