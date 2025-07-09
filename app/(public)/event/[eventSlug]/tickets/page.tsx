import { EventBySlugType } from "@/dal/event/get-event-by-slug";
import { getEventBySlug } from "@/dal/event/get-event-by-slug";
import { TicketCategories } from "./_components/TicketCategories";
// import { OrderDetails } from "./_components/OrderDetails";
import { getTicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ eventSlug: string }> }): Promise<Metadata> {
    const { eventSlug } = await params;
    const event: EventBySlugType = await getEventBySlug(eventSlug);

    return {
        title: "Buy " + event?.title + " Tickets" || "Event Not Found",
        description: event?.description || "The easiest and cheapest ticket purchase is only at GoStage.",
    };
}

export default async function TicketsPage({ params }: { params: Promise<{ eventSlug: string }> }) {
    const { eventSlug } = await params


    return (
        <div className="max-w-5xl mx-auto">
            <Suspense fallback={
                <div className="flex flex-col gap-4 items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin" />
                    Loading Tickets...
                </div>
            }>
                <RenderTicketCategories eventSlug={eventSlug} />
            </Suspense>
        </div>
    )
}

async function RenderTicketCategories({ eventSlug }: { eventSlug: string }) {
    const ticketCategories = await getTicketCategoriesByEventSlug(eventSlug)

    return (
        <TicketCategories ticketCategories={ticketCategories} />
    )
}
