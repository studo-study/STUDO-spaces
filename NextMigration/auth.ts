// auth.ts (in project root, naast package.json)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// ============================================
// NEXTAUTH CONFIGURATIE
// ============================================

export const {
    handlers,  // API route handlers
    signIn,    // Server-side login
    signOut,   // Server-side logout
    signUp,
    auth,      // Session ophalen
} = NextAuth({

    // ==========================================
    // PROVIDERS
    // ==========================================
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            // ========================================
            // AUTHORIZE - Login logica
            // ========================================
            authorize: async (credentials) => {
                try {
                    // STAP 1: Login bij Nest backend → krijg token
                    const loginResponse = await fetch(`${process.env.AUTH_API_URL}/sessions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!loginResponse.ok) {
                        console.error('Login failed:', loginResponse.status);
                        return null;
                    }

                    const { token } = await loginResponse.json();

                    // STAP 2: Haal user data op via /users/me
                    const userResponse = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!userResponse.ok) {
                        console.error('Failed to fetch user:', userResponse.status);
                        return null;
                    }

                    const user = await userResponse.json();

                    // STAP 3: Return user + token
                    return {
                        ...user,
                        accessToken: token,
                    };

                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],

    // ==========================================
    // CUSTOM PAGES
    // ==========================================
    pages: {
        signIn: '/login',
        signUp: '/register'
    },

    // ==========================================
    // SESSION CONFIG
    // ==========================================
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 dagen
    },

    // ==========================================
    // CALLBACKS
    // ==========================================
    callbacks: {
        // ========================================
        // JWT CALLBACK
        // Wordt aangeroepen bij login en bij elke session check
        // ========================================
        jwt: async ({ token, user }) => {
            // Bij login: sla user data en token op
            if (user) {
                token.accessToken = user.accessToken;
                token.user = {
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    img_url: user.img_url,
                    join_date: user.join_date,
                    joinNumber: user.joinNumber,
                    totalSets: user.totalSets,
                    streak_count: user.streak_count,
                    streak_last_update: user.streak_last_update,
                    publicRole: user.publicRole,
                    verified: user.verified,
                    stats: user.stats,
                    lastTen: user.lastTen,
                };
            }
            return token;
        },

        // ========================================
        // SESSION CALLBACK
        // Bepaalt wat beschikbaar is via useSession() en auth()
        // ========================================
        session: async ({ session, token }) => {
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },
});