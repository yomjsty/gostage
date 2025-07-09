import LoginTabs from "@/app/(public)/_components/LoginTabs";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-center mb-4">Login to your account</h1>
            <p className="text-center text-sm text-muted-foreground mb-4">
                Welcome back! Please enter your details to login.
            </p>
            <LoginTabs />
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline underline-offset-4">Register</Link>
            </p>
        </div>
    )
}
