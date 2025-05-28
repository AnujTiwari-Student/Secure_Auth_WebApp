import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from "./auth.config"
import { prisma } from "./prisma"
import { getUserById, updateUser } from '@/data/user';
import NextAuth, { type DefaultSession } from "next-auth"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    events: {
        async linkAccount({ user, account, profile }) {
            console.log("Link Account Event", { user, account, profile });
            const userId = user.id as unknown as string;
            await updateUser(userId);
        }
    },
    callbacks: {
        async session({ session, token }) {
            if(token.sub && session.user){
                session.user.id = token.sub; 
                console.log("Session Callback", { session, token });
            }

            if(token.role && session.user) {
                session.user.role = token.role;
            }

            return session;
        },
        async jwt({token}) {
            console.log("JWT Callback", { token });
            if(!token.sub) return token;
            const user = await getUserById(token.sub);
            if(!user) return token;
            token.role = user?.role;
            return {
                ...token,
                user
            };
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/error",
    }
})