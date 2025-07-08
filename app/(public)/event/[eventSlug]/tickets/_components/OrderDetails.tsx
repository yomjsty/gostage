"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { notFound } from "next/navigation";

interface iAppProps {
    ticketCategories: TicketCategoriesByEventSlug[];
    selectedTickets: { [categoryId: string]: number };
    onRemoveTicket: (categoryId: string) => void;
}

export function OrderDetails({ ticketCategories, selectedTickets, onRemoveTicket }: iAppProps) {
    const thumbnailUrl = useConstructUrl(ticketCategories[0]?.event.featuredImage);

    // Calculate selected tickets and total
    const selectedList = ticketCategories.filter(cat => selectedTickets[cat.id]);
    const totalTickets = selectedList.reduce((sum, cat) => sum + (selectedTickets[cat.id] || 0), 0);
    const totalPrice = selectedList.reduce((sum, cat) => sum + (selectedTickets[cat.id] || 0) * cat.price, 0);

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
                        <Button className="w-full mt-3" disabled={totalTickets === 0} type="button">
                            Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
