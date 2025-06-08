"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Edit2, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/setting";
import { useRef, useState, useTransition } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/ui/form-error";
import AvatarUploader from "@/components/avatar-uploader";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

interface UploadAvatarResponse {
  data?: {
    uploadAvatar?: {
      success: boolean;
      message: string;
    };
  };
  errors?: Array<{ message: string }>;
}

const SettingPage = () => {
  const user = useCurrentUser();

  const {update} = useSession();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name || undefined,
      email: user.email || undefined,
      isTwoFactorEnabled: user.isTwoFactorEnabled || false,
      image: user.image || undefined,
      role: user.role || undefined,
    },
  });

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
  });

  const [isPending, startTransition] = useTransition();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async () => {
    try {
      const res: any = await axios.post("/api/sign-cloudinary-params", {
        public_id: selectedImage.public_id,
      });
      if (res.data.success) {
        toast.success("Image deleted successfully");
        setSelectedImage(null);
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error("Failed to delete image");
        console.error(res.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(async () => {
      try {
        let imageUrl = values.image;
        if (selectedImage) {
          const mutation = `
            mutation UploadAvatar($imageUrl: String!) {
              uploadAvatar(imageUrl: $imageUrl){
                success
                message
              }
            }
          `;
          imageUrl = selectedImage.secure_url;

          const res = await axios.post("/api/graphql", {
            query: mutation,
            variables: { imageUrl },
          });

          console.log("res", res);

          const data = res.data as UploadAvatarResponse;
          if (data?.errors) {
            setError("Failed to upload image.");
            toast.error("Failed to upload image.");
            return;
          } else if (data?.data?.uploadAvatar?.success) {
            toast.success(
              data.data.uploadAvatar.message || "Image uploaded successfully!"
            );
          }
        }
        const settingsRes = await settings({ ...values, image: imageUrl });

        if (settingsRes.error) {
          setError(settingsRes.error);
          toast.error(settingsRes.error);
        } else if (settingsRes.success) {
          await update();
          setSuccess(settingsRes.success);
          toast.success(settingsRes.success);

          setSelectedImage(null);
        }
      } catch (err: Error | any) {
        setError(err.message);
        toast.error(err.message);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="flex gap-2 items-center">
          <span>
            <Settings />
          </span>
          Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  const isEditable = editableFields["name"];
                  return (
                    <FormItem className="relative">
                      <FormLabel>Name</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Name"
                            ref={nameInputRef}
                            disabled={!isEditable || isPending}
                            className={!isEditable ? "text-gray-800" : ""}
                            onFocus={() => {
                              if (!isEditable && nameInputRef.current) {
                                nameInputRef.current.blur();
                              }
                            }}
                            onBlur={() => {
                              setEditableFields((prev) => ({
                                ...prev,
                                name: false,
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
                                name: true,
                              }));
                              form.setValue("name", "");
                              setTimeout(() => {
                                nameInputRef.current?.focus();
                              }, 0);
                            }}
                          />
                        )}
                      </div>
                      <FormDescription>Change Your Name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {!user.isOAuth && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      const isEditable = editableFields["email"];
                      return (
                        <FormItem className="relative">
                          <FormLabel>Email</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="example@gmail.com"
                                ref={emailInputRef}
                                disabled={!isEditable || isPending}
                                className={!isEditable ? "text-gray-800" : ""}
                                onFocus={() => {
                                  if (!isEditable && emailInputRef.current) {
                                    emailInputRef.current.blur();
                                  }
                                }}
                                onBlur={() => {
                                  setEditableFields((prev) => ({
                                    ...prev,
                                    email: false,
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
                                    email: true,
                                  }));
                                  form.setValue("email", "");
                                  setTimeout(() => {
                                    emailInputRef.current?.focus();
                                  }, 0);
                                }}
                              />
                            )}
                          </div>
                          <FormDescription>
                            Change Registered Email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Two Factor Authentication</FormLabel>
                            <FormDescription>
                              Enable 2FA for enhanced security!
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem className="relative">
                      <FormLabel>Profile Image</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <AvatarUploader
                            key={resetTrigger}
                            onSelect={setSelectedImage}
                          />
                        </FormControl>
                        {selectedImage && (
                          <X
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            size={18}
                            onClick={handleDelete}
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
                name="role"
                render={({ field }) => {
                  return (
                    <FormItem className="relative">
                      <FormLabel>Role</FormLabel>
                      <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.user}>User</SelectItem>
                          <SelectItem value={UserRole.admin}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
};

export default SettingPage;
