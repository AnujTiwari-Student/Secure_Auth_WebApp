import { auth } from "@/lib/auth";


export default async function  User() {
    const session = await auth();
    console.log("User", session);

    return session?.user
}