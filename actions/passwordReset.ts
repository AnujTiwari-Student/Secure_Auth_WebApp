"use server";

import { sendPasswordResetEmail } from './../lib/mail';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';

export const passwordReset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
    console.log("Validated fields for reset password", validatedFields);

    if(!validatedFields.success){
        console.log("Validation errors for reset password", validatedFields.error.format());
        return {
            success: false,
            error: "Validation failed",
        };  
    }

    const  { email } = validatedFields.data;

    const user = await getUserByEmail(email);

    if(!user || !user.password){ 
        console.log("User not found for reset password");   
        return {
            success: false,
            error: "Email not resgistered yet!",
        };
    }

    if(user && user.password && user.email){
        console.log("User found, proceeding with password reset");
        const tokenObj = await generatePasswordResetToken(user.email);
        if (!tokenObj || typeof tokenObj.token !== "string") {
            console.error("Failed to generate reset token.");
            return {
                success: false,
                error: "Failed to generate reset token.",
            };
        }
        const token = tokenObj.token;
        await sendPasswordResetEmail(tokenObj.email, token);
        console.log("Generated reset token:", token);
        return {
            success: true,
            message: "Password reset initiated successfully.",
            token,
        }
    }    
}