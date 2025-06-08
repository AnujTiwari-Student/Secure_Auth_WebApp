"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChangePasswordSchema } from "@/schemas";
import { useRef, useState, useTransition } from "react";
import { FormSuccess } from "./ui/form-success";
import { FormError } from "./ui/form-error";
import { changePassword } from "@/actions/setting";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);

  const [editableFields, setEditableFields] = useState({
    password: false,
    newPassword: false,
  });
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(() => {
      changePassword(values)
        .then((data)=>{
            if(data.success){
                form.reset();
                toast.success(data.success);
                setSuccess(data.success);
            }else{
                toast.error(data.error);
                setError(data.error);
            }
        })
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="flex gap-2 items-center">
          <span>
            <Settings />
          </span>
          Change Password
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const isEditable = editableFields["password"];
                  return (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            disabled={!isEditable || isPending}
                            ref={passwordInputRef}
                            className={!isEditable ? "text-gray-800" : ""}
                            onFocus={() => {
                              if (!isEditable && passwordInputRef.current) {
                                passwordInputRef.current?.blur();
                              }
                            }}
                            onBlur={() => {
                              setEditableFields((prev) => ({
                                ...prev,
                                password: false,
                              }));
                            }}
                          />
                        </FormControl>
                        {!isEditable && (
                          <Edit2
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            size={18}
                            onClick={() => {
                              setEditableFields((prev) => ({
                                ...prev,
                                password: true,
                              }));
                              setTimeout(() => {
                                passwordInputRef.current?.focus();
                              }, 0);
                            }}
                          />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => {
                  const isEditable = editableFields["newPassword"];
                  return (
                    <FormItem className="relative">
                      <FormLabel>New Password</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            disabled={!isEditable || isPending}
                            ref={newPasswordInputRef}
                            className={!isEditable ? "text-gray-800" : ""}
                            onFocus={() => {
                              if (!isEditable && newPasswordInputRef.current) {
                                newPasswordInputRef.current?.blur();
                              }
                            }}
                            onBlur={() => {
                              setEditableFields((prev) => ({
                                ...prev,
                                newPassword: false,
                              }));
                            }}
                          />
                        </FormControl>
                        {!isEditable && (
                          <Edit2
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            size={18}
                            onClick={() => {
                              setEditableFields((prev) => ({
                                ...prev,
                                newPassword: true,
                              }));
                              setTimeout(() => {
                                newPasswordInputRef.current?.focus();
                              }, 0);
                            }}
                          />
                        )}
                      </div>
                      <FormDescription>Change Your Password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
