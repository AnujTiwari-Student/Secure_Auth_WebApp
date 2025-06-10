import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export const useCurrentUser = () => {
    const session = useSession();

    return session?.data?.user
}