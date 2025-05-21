"use client"

import * as z from "zod";

export const SignupSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(2, {
        message: "Name must be at least 2 characters long",
    }),
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string({
        required_error: "Password is required",
    }).min(8, {
        message: "Password must be at least 8 characters long",
    })
})
