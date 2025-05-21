import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div>
     <h1>Home Page</h1>
      {session?.user ? (
        <p>Welcome, {session.user.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
