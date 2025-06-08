import { redirect } from "next/navigation"

interface ChangePasswordProps {
    children: React.ReactNode
}

export const ChangePassword = ({children}: ChangePasswordProps) => {

    const onClick = () => {
        redirect("/changePassword");
    }

    return (
        <span onClick={onClick}>{children}</span>
    )
}