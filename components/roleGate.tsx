"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { UserRole } from "@prisma/client";
import { FormError } from "./ui/form-error";

interface RoleGateProps {
    allowedRole: UserRole;
    children: React.ReactNode;
}

export const RoleGate = ({ allowedRole, children }: RoleGateProps) => {

    const role = useCurrentRole();

    if(role !== allowedRole) {
        return(
            <FormError message="You are not authorized." />
        )
    }

    return (
        <>
            {children}
        </>
    )
}