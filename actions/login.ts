"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "../lib/auth";
import { redirectUrl } from "@/path_routes/route";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import prisma from "@/lib/prisma"
import { getTwoFactorConfirmationById } from "@/data/twoFactorConfirmation";

console.log("LoginSchema", LoginSchema);

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    // console.log("Validated fields", validatedFields);

    if (!validatedFields.success) {
        console.log("Validation errors", validatedFields.error.format());
        return {
            success: false,
            error: "Validation failed",
        };
    }

    const { email, password , code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.password || !existingUser.email) {
        // console.log("User not found or missing credentials");
        return {
            success: false,
            error: "Something Went Wrong!",
        };
    }

    if( !existingUser?.emailVerified){
        console.log("Email not verified");
        const verificationToken = await generateVerificationToken(existingUser?.email || email , existingUser?.id);
        if (!verificationToken || typeof verificationToken.token !== "string") {
            // console.error("Failed to generate verification token.");
            return {
                success: false,
                error: "Failed to generate verification token.",
            };
        }
        await sendVerificationEmail(existingUser.email, verificationToken.token);
        // console.log("Verification token created:", verificationToken);
        return {
            success: false,
            error: "Please verify your email before logging in",
            emailVerified: false,
        };
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){

            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken){
                return { success: false , error: "Invalid Code!" };
            }

            if(twoFactorToken.token !== code){
                return { success: false , error: "Invalid Code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if(hasExpired){
                return { success: false , error: "Verification token has expired" };
            }

            await prisma?.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                },
            })

            const existingConfirmation = await getTwoFactorConfirmationById(existingUser.id);

            if(existingConfirmation){
                await prisma?.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id,
                    },
                })
            }

            const newConfirmation = await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                },
            })

            console.log("Two factor confirmed" , newConfirmation);

        } else {

            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(twoFactorToken?.email, twoFactorToken?.token);

            return { success: true , twoFactor: true }

        }        
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: redirectUrl,
        });

        return {
            success: true,
            message: "Login successful",
        };

    } catch (error) {
        console.error("Error during login:", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        success: false,
                        error: "Invalid Credentials",
                    }; 
                default:
                    return {
                        success: false,
                        error: "Something Went Wrong",
                    };
            }
        }
        throw error; 
    }
}