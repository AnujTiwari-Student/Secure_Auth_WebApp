import {prisma} from "../lib/prisma"

export const getResetPassTokenByEmail = async (email: string) => {
    try {
        const resetPassToken = await prisma?.resetPasswordToken.findFirst({
            where: {
                email
            },
        });
        return resetPassToken;
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
}

export const getResetPassTokenByToken = async (token: string) => {
    try {
        const resetPassToken = await prisma?.resetPasswordToken.findUnique({
            where: {
                token
            },
        });
        return resetPassToken
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
}