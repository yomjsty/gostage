import { Button } from "@/components/ui/button";
import { IoLogoGithub } from "react-icons/io";
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { loginWithEmailSchema, LoginWithEmailType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function LoginTabs() {
  const [githubPending, startGithubTransition] = useTransition();

  const form = useForm<LoginWithEmailType>({
    resolver: zodResolver(loginWithEmailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: LoginWithEmailType) {
    console.log(values)
  }

  async function loginWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Redirecting. Please wait...")
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong")
          }
        }
      })
    })
  }

  return (
    <ScrollArea className="max-h-[500px] w-full">
      <div className="py-4 space-y-4">
        <Button size="lg" className="w-full" variant="outline" type="button" onClick={loginWithGithub} disabled={githubPending}>
          <IoLogoGithub className="size-6" />
          Continue with GitHub
          {githubPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
        <div className="flex gap-2 items-center w-full">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-xs underline underline-offset-2 text-muted-foreground"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}
