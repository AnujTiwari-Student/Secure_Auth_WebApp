
import { prisma } from "@/lib/prisma"

export const getTwoFactorConfirmationById = async (userId: string) => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        });
        return twoFactorConfirmation;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}