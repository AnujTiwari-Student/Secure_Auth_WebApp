import { logout } from "@/actions/logout";
import { LogoutButton } from "../../../components/LogoutButton";
import User from "@/hooks/userHook";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const user = await User();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <p className=""><strong>Name:</strong> {user?.name}</p>
      <p className=""><strong>Email:</strong> {user?.email}</p>
      <p className=""><strong>User ID:</strong> {user?.id}</p>
      <p className=""><strong>Role:</strong> {capitalizeFirstLetter(user?.role)}</p>
      <p className=""><strong>Image:</strong> {user?.image || ""}</p>
    </div>
  )
}
