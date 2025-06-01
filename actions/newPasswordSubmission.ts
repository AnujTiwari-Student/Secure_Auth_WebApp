import { NewPasswordSchema } from "@/schemas";
import axios from "axios";
import * as z from "zod"


export const newPasswordSubmission = async (token: string, values: z.infer<typeof NewPasswordSchema>) => {

    const { password , passwordConfirmation } = values

    if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match");
    }

    if(!token){
        throw new Error("Token is required");
    }

    if(!password && !passwordConfirmation){
        throw new Error("Password is required");
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if(!validatedFields.success){
        console.log("Validation errors", validatedFields.error.format());
        return {
            success: false,
            errors: "Validation failed",
        }
    }

    

const mutation = `
        mutation ResetPassword($token: String! , $data: UpdatePasswordInput!){
            resetPassword(token: $token , data: $data){
                message
                success
            }
        }`

    const variables = {
        data: {
            newPassword: password,
            confirmPassword: passwordConfirmation,
        },
        token: token,
    }

    try {
        const reponse = axios.post(`http://localhost:3000/api/graphql`, {
            query: mutation,
            variables: variables,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Response from password reset mutation:", reponse);
        return {
            success: true,
            message: "Password updated successfully.",
        }
    } catch (error) {
        console.error("Error during password reset:", error);
        return {
            success: false,
            error: "Something went wrong during password reset",
        };        
    }

    // Send a request to the server to reset the password
    // ...
}