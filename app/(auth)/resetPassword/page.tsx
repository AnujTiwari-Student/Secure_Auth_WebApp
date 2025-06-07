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
import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { useState, useTransition } from "react";
import Link from "next/link";
import { passwordReset } from "@/actions/passwordReset";

const ResetPassword = () => {

    const [isPending , startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {

        setError("");
        setSuccess("");

        startTransition(()=>{
            console.log("Form values", values)
            passwordReset(values)
              .then(async (res) => {
                if (!res?.success) {
                    setError(res?.error || "Something went wrong");
                    return; 
                }
                setSuccess(res?.message || "Password reset link sent successfully");
                console.log("Password reset link sent successfully", res);
              }).catch((err) => {
                console.error("Error sending password reset link:", err);
                setError(err.message || "Something went wrong.");
            })
        })
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="w-full max-w-md px-6 py-12 space-y-8 bg-white rounded-lg shadow-md sm:px-10">
          
          <div className="text-center">
            <h1 className="text-4xl font-bold">Login</h1>
          </div>

          <Form {...form}>
            <form 
             onSubmit={form.handleSubmit(onSubmit)} 
             className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Mail</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="exapmle@example.com" {...field} type="email" />
                      </FormControl>
                      <FormDescription>
                        Enter same email you used to register.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Send Reset Link
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

  export default ResetPassword;