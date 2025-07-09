import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BannerDataEntry } from "./_components/BannerDataEntry";
import CheckoutStep from "./_components/CheckoutStep";
import { AlertCircleIcon, MailOpen, SquareUser } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
    return (
        <div className="bg-muted-foreground/20 space-y-4">
            <BannerDataEntry />
            <CheckoutStep />
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
                    <div className="col-span-1 md:col-span-5 space-y-4">
                        <Card className="p-0 gap-0">
                            <CardHeader className="flex flex-row items-center justify-between gap-2 py-2 px-4">
                                <div className="flex items-center gap-2">
                                    <MailOpen className="size-4 text-primary" /> <span className="font-extrabold">Buyer Details</span>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <AlertCircleIcon className="size-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>To change buyer details, go to account settings page</p>
                                    </TooltipContent>
                                </Tooltip>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-4">
                                <Card className="p-0 gap-0">
                                    <CardContent className="py-3 px-4 bg-gradient-to-br from-primary/20 via-primary/15 to-card rounded-t-xl space-y-1.5">
                                        <p className="text-sm font-bold">Akbar Krishnawan</p>
                                        <p className="text-xs font-semibold">oweychanges@gmail.com</p>
                                    </CardContent>
                                    <CardFooter className="p-0 bg-primary/20 flex items-center gap-2 py-2 px-4 rounded-b-xl">
                                        <AlertCircleIcon className="size-3" /> <p className="text-xs font-bold tracking-wide">E-ticket will be sent to this email</p>
                                    </CardFooter>
                                </Card>
                            </CardContent>
                        </Card>
                        <Card className="p-0 gap-0">
                            <CardHeader className="py-2 px-4 flex items-center gap-2">
                                <SquareUser className="size-4 text-emerald-400" /> <span className="font-extrabold">Guest 1</span>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-4">
                                <Card className="p-0 gap-0 bg-muted-foreground/5">
                                    <CardContent className="py-3 px-4">
                                        <p className="text-xs font-semibold text-muted-foreground">Ticket Category</p>
                                        <p className="text-sm font-bold">VIP Seat</p>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-1 md:col-span-3">asd</div>
                </div>
            </div>
        </div>
    )
}
