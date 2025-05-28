import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export default { 
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {

            const validatedFields = LoginSchema.safeParse(credentials);

            if(validatedFields.success) {
                const { email , password } = validatedFields.data;
                const user = await getUserByEmail(email);
                if(!user || !user.password) {
                    return null;
                }
                const isValidPassword = await bcrypt.compare(password, user.password);
                if(!isValidPassword) {
                    return null;
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }

            return null;

        },
        }),
    ]
 } satisfies NextAuthConfig