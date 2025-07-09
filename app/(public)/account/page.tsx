import { requireUser } from "@/dal/user/require-user"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountForm } from "./_components/AccountForm";
import { Loader2 } from "lucide-react";
import { SecurityForm } from "./_components/SecurityForm";

export const metadata = {
    title: "Account",
    description: "Manage your account settings.",
};

export default function ProfilePage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <Suspense fallback={
                <div className="flex flex-col gap-2 justify-center items-center py-4">
                    <Loader2 className="size-12 animate-spin" />
                    Loading Account Info...
                </div>
            }>
                <RenderSettingsForm />
            </Suspense>
        </div>
    )
}

async function RenderSettingsForm() {
    const user = await requireUser();

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="space-y-4">
            <AccountForm
                user={{
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber ?? "",
                    address: user.address ?? ""
                }}
            />
            <SecurityForm userId={user.id} />
        </div>
    )
}
