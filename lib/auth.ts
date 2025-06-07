import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from "./auth.config"
import { prisma } from "./prisma"
import { getUserById, updateUser } from '@/data/user';
import NextAuth from "next-auth"
import { getTwoFactorConfirmationById } from '@/data/twoFactorConfirmation';
import { getAccountByUserId } from '@/data/getAccountByUserId';
 
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
        async signIn({ user, account, profile }) {
            console.log("Sign In Callback", { user, account, profile });
            if(account?.provider !== "credentials") return true;
            const userId = user.id as unknown as string;
            if(!userId) {
                console.error("User ID is missing during sign-in");
                return false;
            }
            const existingUser = await getUserById(userId);
            if(!existingUser || !existingUser?.emailVerified) return false;

            console.log("Existing User", existingUser);

            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationById(existingUser.id);
                if(!twoFactorConfirmation) return false;

                await prisma.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id
                    }
                })
            }

            return true;
        },
        async session({ session, token }) {
            if(token.sub && session.user){
                session.user.id = token.sub; 
                console.log("Session Callback", { session, token });
            }

            if(token.role && session.user) {
                session.user.role = token.role;
            }

            if(session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isOAuth = token.isOAuth;
            }

            return session;
        },
        async jwt({token}) {

            if(!token.sub) return token;

            const user = await getUserById(token.sub);
            if(!user) return token;

            const existingAccount = await getAccountByUserId(user.id);

            token.name = user.name;
            token.isOAuth = !!existingAccount;
            token.email = user.email;
            token.role = user.role;
            token.isTwoFactorEnabled = user?.isTwoFactorEnabled;

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