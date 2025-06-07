"use client";

import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/setting";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/ui/form-error";

const SettingPage = () => {

    const user = useCurrentUser();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user.name
        }
    })

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((res) => {

                    if(res.error){
                        setError(res.error)
                        toast.error(res.error)
                    }

                    if(res.success){
                        setSuccess(res.success)
                        toast.success(res.success)
                    }

                })
                .catch((err) => {
                    setError(err.message)
                    console.error(err);
                });
        });
    }
    
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="flex gap-2 items-center"><span><Settings /></span>Settings</p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Name" disabled={isPending} />
                                        </FormControl>
                                        <FormDescription>Change your name</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Name" disabled={isPending} />
                                        </FormControl>
                                        <FormDescription>Change your name</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </div>
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button type="submit" disabled={isPending}>
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default SettingPage;