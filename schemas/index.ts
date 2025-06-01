
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string({
    message: "Password is required",
  })
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  })
})

export const NewPasswordSchema = z.object({
  password: z.string({
    message: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters long",
  }),
  passwordConfirmation: z.string({
    message: "Password confirmation is required",
  })
})

export const SignupSchema = z.object({
  name: z.string({
    message: "Name is required",
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
