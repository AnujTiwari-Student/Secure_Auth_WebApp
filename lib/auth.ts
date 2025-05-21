import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";


    console.log("Prisma client in authOptions", prisma);
    console.log("💡 Prisma Adapter attached:", !!prisma);



export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {

                const {password , email} = credentials as unknown as { password : string , email : string };

                const user = await prisma.user.findFirst({
                    where: { email: email },
                });

                if(!user){
                    throw new Error("No user found with the email");
                }

                const isValidPassword = user.password ? await bcrypt.compare(password, user.password) : false;
                if(!isValidPassword){
                    throw new Error("Invalid password");
                }
                
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    // session: {
    //     strategy: "database",
    //     maxAge: 30 * 24 * 60 * 60,
    // },
    pages: {
        signIn: "/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
};