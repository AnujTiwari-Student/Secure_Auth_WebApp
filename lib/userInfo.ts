import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export const currentUser = async () => {

    const session = await auth();
    return session?.user

}

export const currentRole = async () => {

    const session = await auth();
    return session?.user?.role
}

