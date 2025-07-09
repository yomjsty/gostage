"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

import { TicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug";
import { Ticket } from "lucide-react";
import { OrderDetails } from "./OrderDetails";

interface iAppProps {
    ticketCategories: TicketCategoriesByEventSlug[]
}

export function TicketCategories({ ticketCategories }: iAppProps) {
    // State: { [categoryId]: quantity }
    const [selectedTickets, setSelectedTickets] = useState<{ [categoryId: string]: number }>({});

    // Handler to add ticket
    const handleAddTicket = (category: TicketCategoriesByEventSlug) => {
        const currentQty = selectedTickets[category.id] || 0;
        const remainingQuota = category.quota - category.sold;
        const maxTicketsPerUser = category.event.maxTicketsPerUser;
        if (
            currentQty < maxTicketsPerUser &&
            currentQty < remainingQuota
        ) {
            setSelectedTickets((prev) => ({
                ...prev,
                [category.id]: currentQty + 1,
            }));
        }
    };

    // Handler to remove ticket
    const handleRemoveTicket = (categoryId: string) => {
        setSelectedTickets((prev) => {
            const currentQty = prev[categoryId] || 0;
            if (currentQty > 0) {
                return { ...prev, [categoryId]: currentQty - 1 };
            }
            return prev;
        });
    };

    if (ticketCategories.length === 0) {
        return (
            <div>
                <Card className="px-4 border-none shadow-none bg-gradient-to-b from-gray-500/20 via-gray-300/10 to-background">
                    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <Ticket className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No ticket categories found</h3>
                        <p className="text-sm text-muted-foreground">There are currently no ticket categories available to display.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
            <div className="col-span-1 md:col-span-5 space-y-4">
                <Card className="px-4 border-none shadow-none bg-gradient-to-b from-gray-500/20 via-gray-300/10 to-background">
                    <h1 className="text-lg font-extrabold tracking-tight">Tickets Categories</h1>
                </Card>
                {ticketCategories.map((category) => {
                    const currentQty = selectedTickets[category.id] || 0;
                    const remainingQuota = category.quota - category.sold;
                    const maxTicketsPerUser = category.event.maxTicketsPerUser;
                    const canAdd = currentQty < maxTicketsPerUser && currentQty < remainingQuota;
                    const isSoldOut = category.sold >= category.quota;
                    let limitMessage = null;
                    if (!isSoldOut && currentQty > 0) {
                        if (currentQty >= maxTicketsPerUser) {
                            limitMessage = `You have reached the maximum allowed per user (${maxTicketsPerUser}) for this category.`;
                        } else if (currentQty >= remainingQuota) {
                            limitMessage = `You have reached the remaining quota for this category.`;
                        }
                    }
                    return (
                        <Card key={category.id} className="p-0 px-4 bg-gradient-to-tr from-gray-500/10 via-background to-background">
                            <CardContent className="p-0 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium tracking-wide">{category.name}</p>
                                        <p className="text-sm font-extrabold tracking-tight">Rp {category.price.toLocaleString()}</p>
                                    </div>
                                    {isSoldOut ? (
                                        <Button variant="destructive" disabled type="button">Sold Out</Button>
                                    ) : (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" onClick={() => handleRemoveTicket(category.id)} disabled={currentQty === 0} type="button">-</Button>
                                                <span>{currentQty}</span>
                                                <Button variant="outline" onClick={() => handleAddTicket(category)} disabled={!canAdd} type="button">+</Button>
                                            </div>
                                            {limitMessage && (
                                                <p className="text-xs text-red-600 mt-1">{limitMessage}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Card className="p-2 px-3 bg-gradient-to-bl from-gray-500/10 via-background to-background">
                                    <p className="text-sm font-medium tracking-wide">
                                        Quota: {category.quota}
                                        {(() => {
                                            const remaining = category.quota - category.sold;
                                            if (category.quota === 1 && remaining === 1) {
                                                return <span className="ml-2 text-red-600 font-semibold">(Only 1 ticket available)</span>;
                                            }
                                            if (category.quota === 2 && remaining === 1) {
                                                return <span className="ml-2 text-orange-500 font-semibold">(Only 1 ticket available)</span>;
                                            }
                                            if (remaining > 0 && remaining / category.quota < 0.5) {
                                                return <span className="ml-2 text-yellow-600 font-semibold">(Almost sold out)</span>;
                                            }
                                            return null;
                                        })()}
                                    </p>
                                </Card>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <OrderDetails ticketCategories={ticketCategories} selectedTickets={selectedTickets} onRemoveTicket={handleRemoveTicket} />
        </div>
    )
}
