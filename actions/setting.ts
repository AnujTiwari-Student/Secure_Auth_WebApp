"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/userInfo";

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