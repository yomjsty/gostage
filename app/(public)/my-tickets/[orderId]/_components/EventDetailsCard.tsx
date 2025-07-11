"use client"

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { UserTicketByOrderIdType } from "@/dal/user/get-user-tickets-by-orderid";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";
import { MapPin, ChevronRightIcon, Users } from "lucide-react";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    ticket: UserTicketByOrderIdType
}

export function EventDetailsCard({ ticket }: iAppProps) {
    const thumbnailUrl = useConstructUrl(ticket.category.event.featuredImage)

    return (
        <Card className="p-0 gap-0">
            <Image
                src={thumbnailUrl}
                alt={ticket.category.event.title}
                className="aspect-video"
                width={1200}
                height={800}
            />
            <CardContent className="space-y-4 px-6 py-4">
                <div className="flex-1">
                    <CardTitle className="text-2xl mb-4">{ticket.category.event.title}</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            <span>
                                {ticket.category.event.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{ticket.category.event.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 shrink-0" />
                            <span className="font-semibold">{ticket.category.event.User.name}</span>
                        </div>

                        {ticket.category.event.locationLink && (
                            <Link href={ticket.category.event.locationLink} target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>
                                <ChevronRightIcon className="h-4 w-4 shrink-0" />
                                <span className="font-semibold">View Location</span>
                            </Link>
                        )}
                    </div>
                </div>
                <p className="text-gray-600 whitespace-pre-line text-sm tracking-wide md:text-base">
                    {ticket.category.event.description}
                </p>
            </CardContent>
        </Card>
    )
}
