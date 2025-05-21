import {prisma} from "../../lib/prisma"
import bcrypt from "bcrypt";


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
            const existingUser = await prisma.user.findFirst({
                where: { email },
            })

            if (existingUser) {
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            })
             return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
            };
        },
    }
}