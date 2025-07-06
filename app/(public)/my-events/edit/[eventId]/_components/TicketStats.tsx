"use client"

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTicketCategories } from "@/lib/queries";
import { ChartBarStacked, CircleDollarSign, Ticket } from "lucide-react";
import { TicketCategories } from "@/dal/ticket/get-ticket-categories";

export function TicketStats({ eventId }: { eventId: string }) {
    const { data: ticketCategories, isLoading, error } = useGetTicketCategories(eventId)

    if (isLoading) return (
        <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
    )
    if (error) return <p>Error loading ticket categories</p>

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <Card className="py-4">
                <CardHeader className="gap-2">
                    <span className="text-primary flex items-center gap-2">
                        <CircleDollarSign className="size-4" />
                        Total Revenue
                    </span>
                    <p className="text-2xl font-bold">Rp. {ticketCategories?.reduce((acc: number, category: TicketCategories) => acc + (category.price * category.sold), 0)?.toLocaleString()}</p>
                </CardHeader>
            </Card>
            <Card className="py-4">
                <CardHeader className="gap-2">
                    <span className="text-primary flex items-center gap-2">
                        <Ticket className="size-4" />
                        Ticket Sold
                    </span>
                    <p className="text-2xl font-bold">{ticketCategories?.reduce((acc: number, category: TicketCategories) => acc + category.sold, 0)}/{ticketCategories?.reduce((acc: number, category: TicketCategories) => acc + category.quota, 0)}</p>
                </CardHeader>
            </Card>
            <Card className="py-4">
                <CardHeader className="gap-2">
                    <span className="text-primary flex items-center gap-2">
                        <ChartBarStacked className="size-4" />
                        Ticket Categories
                    </span>
                    <p className="text-2xl font-bold">{ticketCategories?.length || 0}</p>
                </CardHeader>
            </Card>
        </div>
    )
}
