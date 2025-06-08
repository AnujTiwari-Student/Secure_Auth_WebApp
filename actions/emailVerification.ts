"use server"

import { prisma } from "@/lib/prisma";
import {  getUserById } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";

export const verifyEmail = async (token: string) => {
    try {
        
        const verificationToken = await getVerificationTokenByToken(token);

        if (!verificationToken) {
            console.error("Verification token not found");
            return {
                success: false,
                error: "Invalid or expired verification token",
            };
        }

        const user = await getUserById(verificationToken.userId);
        
        if (!user || !user.id) {
            console.error("User not found.");
            return {
                success: false,
                error: "User not found",
            };
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();
        if (hasExpired) {   
            console.error("Verification token has expired");
            return {
                success: false,
                error: "Verification token has expired",
            };
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: new Date(),
                email: verificationToken.email, 
            },
        });

        if(updatedUser){
            await prisma.verificationToken.delete({
                where: {
                    identifier: verificationToken.identifier,
                },
            })
        }

        return {
            success: true,
            message: "Email verified successfully",
            emailVerified: true,
        }

    } catch (error) {
        console.error("Error verifying email:", error);
        return {
            success: false,
            error: "Verification failed",
        };      
    }
}