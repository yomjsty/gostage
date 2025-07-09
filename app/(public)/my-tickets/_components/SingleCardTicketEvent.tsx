"use client"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { UserTicketType } from "@/dal/user/get-user-tickets"
import Image from "next/image"
import { useConstructUrl } from "@/hooks/use-construct-url"

interface SingleCardTicketEventProps {
    event: UserTicketType["category"]["event"]
    total: number
    orderId?: string
}

export function SingleCardTicketEvent({ event, total, orderId }: SingleCardTicketEventProps) {
    const thumbnailUrl = useConstructUrl(event.featuredImage)
    return (
        <Card className="p-0 gap-0">
            <CardContent className="grid grid-cols-8 gap-4 p-4">
                <div className="col-span-3 md:col-span-2 relative aspect-video">
                    {event.featuredImage ? (
                        <Image
                            src={thumbnailUrl}
                            alt={event.title}
                            fill
                            className="rounded object-cover"
                        />
                    ) : (
                        <div className="bg-muted w-full h-full rounded" />
                    )}
                </div>

                <div className="col-span-5 md:col-span-6">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <p className="font-extrabold tracking-wide">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>

                        <div className="hidden md:flex items-center justify-between gap-2 mt-2">
                            <div className="w-2/3 flex flex-col">
                                <span className="text-xs font-semibold text-muted-foreground">Event Date</span>
                                <span className="text-sm font-medium">
                                    {event.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex w-1/3 flex-col">
                                <span className="text-xs font-semibold text-muted-foreground">Total</span>
                                <span className="text-sm font-medium">{total} Tickets</span>
                            </div>
                            <div>
                                <Link
                                    href={orderId ? `/my-tickets/${orderId}` : "#"}
                                    className={cn(buttonVariants({ variant: "default" }))}
                                >
                                    Show E-Tickets
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <Separator className="md:hidden" />

            {/* Mobile layout */}
            <CardContent className="p-4 md:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-muted-foreground">Event Date</span>
                        <span className="text-xs font-medium">
                            {event.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-muted-foreground">Total</span>
                        <span className="text-xs font-medium">{total} Tickets</span>
                    </div>
                    <div>
                        <Link
                            href={orderId ? `/my-tickets/${orderId}` : "#"}
                            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                        >
                            E-Tickets
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
