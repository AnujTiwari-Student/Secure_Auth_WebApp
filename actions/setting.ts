"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { ChangePasswordSchema, SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/userInfo";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    
    const user = await currentUser();

    if(!user){
        return {
            error: "Unauthorized",
        };
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser){
        return {
            error: "Unauthorized",
        };
    }

    if(user?.isOAuth){
        values.email = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return {
                error: "Email already in use!",
            };
        }

        const verificationToken = await generateVerificationToken(values.email , dbUser.id);

        if (!verificationToken || typeof verificationToken.token !== "string") {
            return {
                error: "Failed to generate verification token.",
            };
        }

        await sendVerificationEmail(verificationToken?.email, verificationToken?.token);

        return {
            success: "Verification email sent successfully",
        }

    }

    const updatedUser = await prisma.user.update({
        where: {
            id: dbUser.id,
        },
        data: {
            ...values,
        }
    })

    return {
        success: "Settings updated successfully",
        data: updatedUser,
    };

};

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {

    const user = await currentUser();
    if(!user){
        return {
            error: "Unauthorized",
        };
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser){
        return {
            error: "Unauthorized",
        };
    }

    if(user.isOAuth){
        return user;
    }

    if(!dbUser.password){
        return {
            error: "Password not found",
        };
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if(!passwordMatch){
            return {
                error: "Invalid password",
            };
        }

        if (passwordMatch) {
            const hashedPassword = await bcrypt.hash(values.newPassword, 10);
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { password: hashedPassword },
            });

            return { success: "Password changed successfully" };
        }

        return { error: "Invalid password" };
    }

}