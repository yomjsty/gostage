import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleQuestionMarkIcon, Home, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function PaymentFailed() {
    return (
        <div className="max-w-sm mx-auto py-32">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-600">Payment Failed!</CardTitle>
                    <CardDescription>
                        We were unable to process your payment. Please check the details below and try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link href={`/support`} className={cn(buttonVariants({ variant: "default", className: "w-full" }))}>
                            <CircleQuestionMarkIcon className="mr-2 h-4 w-4" />
                            Contact Support
                        </Link>
                        <Link href={`/`} className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}>
                            <Home className="mr-2 h-4 w-4" />
                            Return to Dashboard
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="rounded-lg bg-yellow-50 p-3">
                        <p className="text-xs text-yellow-800">
                            Need help? Contact our support team at support@company.com or call 1-800-123-4567. We&apos;re available 24/7 to assist you.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
