import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from "./auth.config"
import { prisma } from "./prisma"
import { getUserById } from '@/data/user';
import NextAuth, { type DefaultSession } from "next-auth"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
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
            //@ts-ignore
            token.role = user?.role;
            return {
                ...token,
                user
            };
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
})