"use client";
import { SignupSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { signup } from "@/actions/signup";

export default function Register() {

    const form = useForm<z.infer<typeof SignupSchema>>({
      resolver: zodResolver(SignupSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
      }
    })

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (values: z.infer<typeof SignupSchema>) => {
      try {
          setError("");
          setSuccess("");

          startTransition(() => {
            console.log("Form values", values);
            signup(values)
              .then((res) => {
                if (!res) {
                  setError("Something went wrong.");
                  return;
                }

                if (!res.success) {
                  setError(res.error);
                } else {
                  setSuccess(res.message);
                  window.location.href = "/home";
                }
              });
          });
      } catch (err: any) {
          setError(err.message || "Something went wrong");
      }
    };
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="w-full max-w-md px-6 py-12 space-y-8 bg-white rounded-lg shadow-md sm:px-10">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold">Register</h1>
        </div>

        <Form {...form}>
          <form 
            action=""
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="text" {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="email" {...field} placeholder="Enter your email" />
                    </FormControl>
                    <FormError />
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
                      <Input disabled={isPending} type="password" {...field} placeholder="********" />
                    </FormControl>
                    <FormError />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}