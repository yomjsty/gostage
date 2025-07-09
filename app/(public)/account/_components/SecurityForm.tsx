import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { SetPassword } from "./SetPassword";
import { isPasswordSet } from "../actions";
import { ChangePassword } from "./ChangePassword";

export async function SecurityForm({ userId }: { userId: string }) {
    const havePassword = await isPasswordSet(userId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {havePassword.success ? <ChangePassword /> : <SetPassword />}
            </CardContent>
        </Card>
    )
}
