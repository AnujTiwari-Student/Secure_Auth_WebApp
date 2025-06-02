
import { prisma } from "@/lib/prisma"

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: {
                email: email
            }
        });
        return twoFactorToken;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findUnique({
            where: {
                token: token
            }
        });
        return twoFactorToken;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}