"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "../lib/auth";
import { redirectUrl } from "@/path_routes/route";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getVerificationTokenByEmail } from "@/data/verificationToken";

console.log("LoginSchema", LoginSchema);

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    console.log("Validated fields", validatedFields);

    if (!validatedFields.success) {
        console.log("Validation errors", validatedFields.error.format());
        return {
            success: false,
            error: "Validation failed",
        };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.password || !existingUser.email) {
        console.log("User not found or missing credentials");
        return {
            success: false,
            error: "Something Went Wrong!",
        };
    }

    if( !existingUser?.emailVerified){
        console.log("Email not verified");
        const verificationToken = await generateVerificationToken(existingUser?.email || email);
        console.log("Verification token created:", verificationToken);
        return {
            success: false,
            error: "Please verify your email before logging in",
            emailVerified: false,
        };
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