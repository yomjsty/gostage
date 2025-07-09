import RegisterTabs from "@/app/(public)/_components/RegisterTabs";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-center mb-4">Create an account</h1>
            <p className="text-center text-sm text-muted-foreground mb-4">
                Create an account to get started.
            </p>
            <RegisterTabs />
            <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary hover:underline underline-offset-4">Login</Link>
            </p>
        </div>
    )
}
