import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home, Ticket } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function PaymentSuccess() {
    return (
        <div className="max-w-sm mx-auto py-32">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                    <CardDescription>
                        Thank you for your purchase. Your payment has been processed successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link href={`/my-tickets`} className={cn(buttonVariants({ variant: "default", className: "w-full" }))}>
                            <Ticket className="mr-2 h-4 w-4" />
                            View Tickets
                        </Link>
                        <Link href={`/`} className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}>
                            <Home className="mr-2 h-4 w-4" />
                            Return to Dashboard
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-xs text-blue-800">
                            A confirmation email has been sent to your registered email address. If you have any questions, please
                            contact our support team.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
