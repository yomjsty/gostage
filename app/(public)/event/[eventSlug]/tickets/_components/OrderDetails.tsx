"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { createSnapToken } from "../actions";
import { toast } from "sonner";
import { env } from "@/lib/env";
import { AlertCircleIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SnapResult = {
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_status: string;
    [key: string]: unknown; // for extra fields
};

declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: SnapResult) => void;
                    onPending?: (result: SnapResult) => void;
                    onError?: (result: SnapResult) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}

export { };

interface iAppProps {
    ticketCategories: TicketCategoriesByEventSlug[];
    selectedTickets: { [categoryId: string]: number };
    onRemoveTicket: (categoryId: string) => void;
}

export function OrderDetails({ ticketCategories, selectedTickets, onRemoveTicket }: iAppProps) {
    const { data: session, isPending } = authClient.useSession()
    const [pending, startTransition] = useTransition();
    const router = useRouter();
    // const [snapPay, startSnapPay] = useTransition();
    const thumbnailUrl = useConstructUrl(ticketCategories[0]?.event.featuredImage);

    // Calculate selected tickets and total
    const selectedList = ticketCategories.filter(cat => selectedTickets[cat.id]);
    const totalTickets = selectedList.reduce((sum, cat) => sum + (selectedTickets[cat.id] || 0), 0);
    const totalPrice = selectedList.reduce((sum, cat) => sum + (selectedTickets[cat.id] || 0) * cat.price, 0);

    const handleCheckout = () => {
        // SECURE VERSION: Only send ticket IDs and quantities to server
        const ticketDetails = selectedList.map(cat => ({
            id: cat.id,
            quantity: selectedTickets[cat.id],
        }));

        const payload = {
            tickets: ticketDetails,
        };

        startTransition(async () => {
            const { data: result, error } = await tryCatch(createSnapToken(payload))

            if (error) {
                if (error.message === "NEXT_REDIRECT") {
                    toast.error("You need to login to checkout")
                } else {
                    toast.error(error.message)
                }
                return
            }

            if (!result?.token) {
                toast.error("Unknown error occurred. Please try again later.")
                return
            }

            if (result.token) {
                window.snap.pay(result.token, {
                    onSuccess: function (result) {
                        toast.success("Payment Success!");
                        console.log("Success:", result);
                        router.refresh();
                        router.push(`/payment?result=success`);
                    },
                    onPending: function (result) {
                        toast("Payment Pending...");
                        console.log("Pending:", result);
                        router.refresh();
                    },
                    onError: function (result) {
                        toast.error("Payment Failed!");
                        console.error("Error:", result);
                        router.refresh();
                        router.push(`/payment?result=failed`);
                    },
                    onClose: function () {
                        toast("Payment popup closed without completing the payment.");
                        router.refresh();
                    }
                });
            }
        })
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="col-span-1 md:col-span-3">
            <div className="sticky md:top-4 self-start">
                <Card className="gap-2 pb-4">
                    <div className="px-4">
                        <h1 className="text-lg font-extrabold tracking-tight">Order Details</h1>
                    </div>
                    <CardContent className="px-4">
                        {ticketCategories[0] ? (
                            <div className="grid grid-cols-2 gap-5">
                                <Image
                                    src={thumbnailUrl}
                                    alt={ticketCategories[0].event.title}
                                    className="w-full aspect-video object-cover"
                                    width={600}
                                    height={400}
                                    priority
                                />
                                <div className="flex flex-col justify-around">
                                    <h3 className="text-sm font-bold tracking-tight line-clamp-1">{ticketCategories[0].event.title}</h3>
                                    <p className="text-sm font-medium line-clamp-1">{ticketCategories[0].event.startDate.toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{ticketCategories[0].event.location}</p>
                                </div>
                            </div>
                        ) : (
                            notFound()
                        )}
                        <Separator className="mt-4 mb-2" />
                        <div className="space-y-2">
                            {selectedList.length === 0 ? (
                                <span className="text-[13px] tracking-wide font-medium">0 Ticket Selected</span>
                            ) : (
                                selectedList.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between text-[13px]">
                                        <span>{cat.name} x {selectedTickets[cat.id]}</span>
                                        <span>Rp {(cat.price * selectedTickets[cat.id]).toLocaleString()}</span>
                                        <Button variant="ghost" size="sm" onClick={() => onRemoveTicket(cat.id)} type="button">Remove</Button>
                                    </div>
                                ))
                            )}
                        </div>
                        <Separator className="mt-3 mb-3" />
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] tracking-wide font-medium">Total</span>
                            <span className="text-[13px] tracking-wide font-extrabold">Rp {totalPrice.toLocaleString()}</span>
                        </div>
                        {isPending ? null : session ? (
                            <Button className="w-full mt-3" disabled={totalTickets === 0 || pending} type="button"
                                onClick={handleCheckout}
                            >
                                {pending ? "Processing..." : "Checkout"}
                            </Button>
                        ) : (
                            <Link className={cn(buttonVariants({ variant: "default", className: "w-full mt-3" }))} href="/login"
                            >
                                Login to Checkout
                            </Link>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                            <AlertCircleIcon className="size-3 shrink-0" /> You will be given 20 minutes max window to complete your payment.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
