import { TicketCategories } from "./_components/TicketCategories";
// import { OrderDetails } from "./_components/OrderDetails";
import { getTicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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
