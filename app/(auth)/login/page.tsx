"use client";

import { signIn } from "next-auth/react";
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
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";

export default function Login() {

    const [isPending , startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");

        startTransition(()=>{
            console.log("Form values", values);
            login(values)
              .then((res)=>{
                setError(res.error);
                setSuccess(res.message);
                window.location.href = "/home";
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
             action=""
             onSubmit={form.handleSubmit(onSubmit)} 
             className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="exapmle@example.com" {...field} type="email" />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="********" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Login into your Account
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }