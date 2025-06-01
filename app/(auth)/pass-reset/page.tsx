"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "../../../components/ui/form";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { useState, useTransition } from "react";
import { redirectUrl } from "@/path_routes/route";
import Link from "next/link";
import { passwordReset } from "@/actions/passwordReset";
import { useRouter, useSearchParams } from "next/navigation";
import { newPasswordSubmission } from "@/actions/newPasswordSubmission";

const ResetPasswordForm = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isPending , startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {

        setError("");
        setSuccess("");

        if(!token){
            setError("Invalid token")
            return;
        }

        startTransition(()=>{
            console.log("Form values", values)
            newPasswordSubmission(token , values)
              .then(async (res) => {
                if (res.success) {
                    setSuccess("Password reset successful.")
                    router.push("/login")
                } else {
                    setError("Something went wrong.")
                }
              }).catch((err) => {
                console.error("Error updating password:", err);
                setError(err.message || "Something went wrong.");
            
            })
        })
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="w-full max-w-md px-6 py-12 space-y-8 bg-white rounded-lg shadow-md sm:px-10">
          
          <div className="text-center">
            <h1 className="text-4xl font-bold">Reset Password</h1>
          </div>

          <Form {...form}>
            <form 
             onSubmit={form.handleSubmit(onSubmit)} 
             className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="********" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="********" {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Make sure it's same as new password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </Form>
          <div>
        </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/login" className="text-black hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  export default ResetPasswordForm;