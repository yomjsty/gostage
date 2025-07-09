"use client"

import { useForm } from "react-hook-form";
import { setPasswordSchema, SetPasswordType } from '../../../../lib/zodSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { setPassword } from "../actions";
import { toast } from "sonner";

export function SetPassword() {
    const [isPending, startTransition] = useTransition();
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const toggleVisibility = () => setIsVisible((prevState) => !prevState)
    const form = useForm<SetPasswordType>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: SetPasswordType) {
        startTransition(async () => {
            const isConfirmationMismatch = values.password !== values.confirmPassword;

            if (isConfirmationMismatch) {
                toast.error("New password and confirmation do not match");
                return;
            }

            try {
                await setPassword(values);
                window.location.reload();
                toast.success("Password set")
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
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
                            <FormDescription>
                                You just signed up with OAuth, please set a password for your account.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Set Password
                </Button>
            </form>
        </Form>
    )
}
