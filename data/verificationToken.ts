import {prisma} from "../lib/prisma"

export const getVerificationRokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma?.verificationToken.findUnique({
            where: {
                email
            },
        });
        return token;
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
}