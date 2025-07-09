"use client"

import { useForm } from "react-hook-form";
import { changePasswordSchema, ChangePasswordType } from '../../../../lib/zodSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function ChangePassword() {
    const [isPending, startTransition] = useTransition();
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const toggleVisibility = () => setIsVisible((prevState) => !prevState)
    const form = useForm<ChangePasswordType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            revokeOtherSessions: false,
        },
    })

    function onSubmit(values: ChangePasswordType) {
        startTransition(async () => {
            const isSameAsCurrent = values.currentPassword === values.newPassword;
            const isConfirmationMismatch = values.newPassword !== values.confirmNewPassword;

            if (isSameAsCurrent) {
                toast.error("New password cannot be the same as the current password");
                return;
            }

            if (isConfirmationMismatch) {
                toast.error("New password and confirmation do not match");
                return;
            }
            try {
                const { error } = await authClient.changePassword({
                    newPassword: values.newPassword,
                    currentPassword: values.currentPassword,
                    revokeOtherSessions: values.revokeOtherSessions,
                });

                if (error) {
                    toast.error(error.message);
                } else {
                    window.location.reload();
                    toast.success("Password changed successfully");
                }
            } catch {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        className="pe-9"
                                        {...field}
                                        type={isVisible ? "text" : "password"}
                                    />
                                    <button
                                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                        aria-pressed={isVisible}
                                        aria-controls="password"
                                    >
                                        {isVisible ? (
                                            <EyeOffIcon size={16} aria-hidden="true" />
                                        ) : (
                                            <EyeIcon size={16} aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        className="pe-9"
                                        {...field}
                                        type={isVisible ? "text" : "password"}
                                    />
                                    <button
                                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                        aria-pressed={isVisible}
                                        aria-controls="password"
                                    >
                                        {isVisible ? (
                                            <EyeOffIcon size={16} aria-hidden="true" />
                                        ) : (
                                            <EyeIcon size={16} aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        className="pe-9"
                                        {...field}
                                        type={isVisible ? "text" : "password"}
                                    />
                                    <button
                                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                        aria-pressed={isVisible}
                                        aria-controls="password"
                                    >
                                        {isVisible ? (
                                            <EyeOffIcon size={16} aria-hidden="true" />
                                        ) : (
                                            <EyeIcon size={16} aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="revokeOtherSessions"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox
                                    id="revokeOtherSessions"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    ref={field.ref}
                                />
                            </FormControl>
                            <FormLabel htmlFor="revokeOtherSessions">Revoke other sessions</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Change Password
                </Button>
            </form>
        </Form>
    )
}
