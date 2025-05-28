"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "../lib/auth";
import { redirectUrl } from "@/path_routes/route";
import { AuthError } from "next-auth";

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