"use server";
import { SignupSchema } from "@/schemas";
import axios from "axios";
import * as z from "zod";

console.log("LoginSchema", SignupSchema);

const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(), 
});


        
type UserResponse = z.infer<typeof UserResponseSchema>;


export const signup = async (values: z.infer<typeof SignupSchema>) => {

    const validatedFields = SignupSchema.safeParse(values);
    console.log("Validated fields", validatedFields);

    if (!validatedFields.success) {
        console.log("Validation errors", validatedFields.error.format());
        return {
            success: false,
            error: "Validation failed",
        };
    }

    const { name, email, password } = validatedFields.data;

    const mutation = `
        mutation CreateUser($data: UserInput!) {
            createUser(data: $data) {
                id
                name
                email
            }
          }
        `;
    
        const variables = {
          data: {
            name,
            email,
            password
          }
        };
    
      try {
        const response = await axios.post(`http://localhost:3000/api/graphql`, {
            query: mutation,
            variables: variables,
            }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        const result = response.data as {
            data: {
                createUser: UserResponse;
            };
            errors?: { message: string }[];
        };

        console.log("Result", result);

        if (result.errors) {
            console.log("GraphQL Errors", result.errors);
            return {
                success: false,
                error: result.errors[0]?.message || "GraphQL Error",
            };
        }

        const validateResult = UserResponseSchema.safeParse(result.data.createUser);
        console.log("Validate result", validateResult);

        if (!validateResult.success) {
            return {
                success: false,
                error: "Invalid user data returned from server",
            };
        }

        return {
            success: true,
            message: `Verification Email Sent.`,
            emailVerified: false,
        };
    
    
      } catch (error: any) {
        return {
            success: false,
            error: error.message || "Something went wrong",
        };
      }
}