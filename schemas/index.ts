
import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  role: z.enum([UserRole.user, UserRole.admin]).optional()
})

export const ChangePasswordSchema = z.object({
  password: z.string({
    message: "Password is required",
  }),
  newPassword: z.string({
    message: "New password is required",
  }).min(8, {
    message: "New password must be at least 8 characters long",
  })
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }
    return true;
  },{
    message: "New password is required",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }
    return true;
  },{
    message: "Password is required",
    path: ["password"]
  });
  

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string({
    message: "Password is required",
  }),
  code: z.optional(z.string()),
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
