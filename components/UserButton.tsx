"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "./LogoutButton";
import { LogOut, PencilLine } from "lucide-react";
import { ChangePassword } from "./ChangePassword";

type Props = {
  user: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
    isOAuth?: boolean;
  } | null;
};

export const UserButton = ({ user }: Props) => {
  // console.log("Current User details", user);
  // console.log("Image", user?.image);

  const validImage =
    user?.image && !user.image.includes("googleusercontent")
      ? user.image
      : "https://github.com/shadcn.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={validImage} />
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!user?.isOAuth && (
          <ChangePassword>
            <DropdownMenuItem>
              <PencilLine className="mr-2 h-6 w-6" />
              Change Password
            </DropdownMenuItem>
          </ChangePassword>
        )}
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
