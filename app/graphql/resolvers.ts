import { getUserByEmail } from "@/data/user";
import {prisma} from "../../lib/prisma"
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { sendVerificationEmail } from "@/lib/mail";
import { getResetPassTokenByToken } from "@/data/resetPassToken";
import { getTwoFactorTokenByToken } from "@/data/twoFactorToken";


export const resolvers = {
    Query: {
        _empty: () => "Hello World",
    },
    Mutation: {
        createUser: async (_: unknown, args: { data: { name: string; email: string; password: string; } }) => {

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

            if (!user || !user.id || !user.email) {
                throw new Error("Failed to create user");
            }

            const verificationToken = await generateVerificationToken(email);
                if (!verificationToken || typeof verificationToken.token !== "string") {
                console.error("Failed to generate verification token.");
                return {
                    success: false,
                    error: "Failed to generate verification token.",
                };
            }
            await sendVerificationEmail(user.email, verificationToken.token);
            console.log("Verification token created:", verificationToken);

             return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
            };
        },
        emailVerification: async (_: unknown, args: { token: string }) => {
            const { token } = args;
            if (!token) {
                throw new Error("Token is required for email verification");
            }
            const verificationToken = await getVerificationTokenByToken(token);

            if (!verificationToken) {
                console.error("Verification token not found");
                return {
                    success: false,
                    error: "Invalid or expired verification token",
                };
            }

            const user = await getUserByEmail(verificationToken.email);
            if (!user) {
                console.error("User not found.");
                return {
                    success: false,
                    error: "User not found",
                };
            }

            const hasExpired = new Date(verificationToken.expires) < new Date();

            if (hasExpired) {   
                console.error("Verification token has expired");
                return {
                    success: false,
                    error: "Verification token has expired",
                };
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: new Date(),
                    email: verificationToken.email, 
                },
            });

            if(updatedUser){
                await prisma.verificationToken.delete({
                    where: {
                        identifier: verificationToken.identifier,
                    },
                })
            }

            return {
                success: true,
                message: "Email verified successfully",
                emailVerified: true,
            };

        },
        resetPassword: async (_: unknown , args: {token: string, data: { newPassword: string , confirmPassword: string }}) => {
            
            const { token , data } = args;
            const { newPassword, confirmPassword } = data;
            
            if (!token) {
                throw new Error("Token is required for password reset");
            }

            if (!newPassword || !confirmPassword) {
                return {
                    success: false,
                    message: null,
                    error: "Both fields are required.",
                };
            }

            if (newPassword !== confirmPassword) {
                return {
                    success: false,
                    message: null,
                    error: "Passwords do not match.",
                };
            }

            const resetPassToken = await getResetPassTokenByToken(token);

            if (!resetPassToken) {
                console.error("Verification token not found");
                return {
                    success: false,
                    error: "Invalid or expired verification token",
                };
            }

            const user = await getUserByEmail(resetPassToken.email);
            if (!user) {
                console.error("User not found.");
                return {
                    success: false,
                    error: "User not found",
                };
            }

            const hasExpired = new Date(resetPassToken.expires) < new Date();

            if (hasExpired) {   
                console.error("Verification token has expired");
                return {
                    success: false,
                    error: "Verification token has expired",
                };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                },
            })

            if(updatedUser){
                await prisma.resetPasswordToken.delete({
                    where: {
                        identifier: resetPassToken.identifier,
                    },
                })
            }

            return {
                success: true,
                message: "Password reset successfully",
            }
        },
        twoFactorAuthentication: async(_: unknown , args: {token: string}) => {
            const { token } = args;
            if (!token) {
                throw new Error("Token is required for 2FA");
            }
            const twoFactorToken = await getTwoFactorTokenByToken(token);

            if (!twoFactorToken) {
                console.error("Verification token not found");
                return {
                    success: false,
                    error: "Invalid or expired verification token",
                };
            }

            const user = await getUserByEmail(twoFactorToken.email);
            if (!user) {
                console.error("User not found.");
                return {
                    success: false,
                    error: "User not found",
                };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                console.error("Verification token has expired");
                return {
                    success: false,
                    error: "Verification token has expired",
                };
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    isTwoFactorEnabled: true,
                },
            })

            if(updatedUser){
                await prisma.twoFactorToken.delete({
                    where: {
                        id: twoFactorToken.id,
                    },
                })
            }

            return {
                success: true,
                message: "2FA mail sent successfully",
            }   
        }
    }
}