import { auth, signOut } from "@/lib/auth";

export default async function Home() {

  const session = await auth();
  console.log("Session in Home Page", session);

  return (
    <div>
     <h1>Home Page</h1>
      <p>{JSON.stringify(session)}</p>

      {/* Display user information if available */}
      {session?.user ? (
        <p>Welcome, {session.user.name}</p>
      ) : (
        <p>Please log in</p>
      )}

      <form action={
        async () => {
          "use server";
          console.log("Logging out user");
          await signOut();
        }
      }>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  )
}
