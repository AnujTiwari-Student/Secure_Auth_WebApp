"use client";

import { BeatLoader } from "react-spinners"
import { CardWrapper } from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "@/actions/emailVerification";
import { FormError } from "./ui/form-error";
import { FormSuccess } from "./ui/form-success";

export const EmailVerificationForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const onSubmit = useCallback(async () => {
        console.log("Verifying email with token:", token);
        if (!token) {
            setError("Verification token is missing.");
            return;
        }
        verifyEmail(token)
        .then((data)=>{
            if (!data || !data.success) {
                setError(data?.error || "Something went wrong.");
                return;
            }
            setSuccess(data.message);
            console.log("Email verified successfully:", data);
        }).catch((err) => {
            console.error("Error verifying email:", err);
            setError(err.message || "Something went wrong.");
        })
    } , [token])

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <CardWrapper 
                headerLabel="Verifying your email"
                backButton="Back to Login" 
                backButtonHref="/login"
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-gray-600">Please wait while we verify your email</p>
                    {!success && !error && (
                        <div>
                            <BeatLoader
                                color="#4F46E5"
                                size={15}
                                className="mt-4"
                            />
                        </div>
                    )}
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>
            </CardWrapper>
        </div>
    )
}