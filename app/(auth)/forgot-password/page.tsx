"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
})

export default function ForgotPasswordPage() {
    const [pending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const { data, error } = await authClient.requestPasswordReset({
                    email: values.email,
                    redirectTo: "/reset-password",
                });
                if (error) {
                    toast.error(error.message)
                    return
                }
                if (data) {
                    toast.success("If account with that email exists, we will send you a password reset email.")
                }
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong")
            }
        })
    }

    return (
        <div className="">
            <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
            <p className="text-center text-sm text-muted-foreground mb-4">
                Please enter your email to reset your password.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@doe.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Request Password Reset
                    </Button>
                </form>
            </Form>
            <p className="text-center text-sm text-muted-foreground mt-4">
                Remember your password? <Link href="/login" className="text-primary hover:underline underline-offset-4">Login</Link>
            </p>
        </div>
    )
}

