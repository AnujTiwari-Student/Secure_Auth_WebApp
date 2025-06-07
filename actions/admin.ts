"use server"

import { currentRole } from "@/lib/userInfo"
import { UserRole } from "@prisma/client";


export const admin = async () => {
    const role = await currentRole();
    if(role === UserRole.admin){
        return { success: "Allowed" };
    }

    return { error: "Not allowed" };
}