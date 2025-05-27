"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";

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
    
    return {
        success: true,
        message: "Login successful",
    }
}