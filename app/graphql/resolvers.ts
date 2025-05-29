import { getUserByEmail } from "@/data/user";
import {prisma} from "../../lib/prisma"
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { sendVerificationEmail } from "@/lib/mail";


export const resolvers = {
    Query: {
        _empty: () => "Hello World",
    },
    Mutation: {
        createUser: async (_: any, args: { data: { name: string; email: string; password: string; } }) => {

            const { name, email, password } = args.data;

            if(!name || !email || !password){
                throw new Error("Missing fields");
            }

            const existingUser = await getUserByEmail(email);

            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            })

            const verfificationToken = await generateVerificationToken(email);
            console.log("Verification token created:", verfificationToken);

             return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
            };
        },
    }
}