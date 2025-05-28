import { prisma } from '../lib/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export const updateUser = async (id:  string)=>{
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                emailVerified: new Date(),
            }
        });
        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
}