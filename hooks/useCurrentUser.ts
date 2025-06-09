import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export const useCurrentUser = () => {
    const session = useSession();

    if(!session?.data?.user){
        redirect("/login");
    }

    return session?.data?.user
}