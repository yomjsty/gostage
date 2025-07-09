import { ChevronLeft, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EditEventForm } from "./_components/EditEventForm";
import { getOrganizerEvent } from "@/dal/organizer/get-organizer-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketManagement } from "./_components/TicketManagement";
import { TicketStats } from "./_components/TicketStats";
import { Suspense } from "react";

export const metadata = {
    title: "Edit Event",
    description: "Edit your event information.",
};

export default async function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;

    return (
        <div className="space-y-4">
            <div className="px-8 py-12 bg-accent-foreground rounded-xl flex items-center justify-between">
                <Link href="/my-events" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ChevronLeft className="size-4" />
                </Link>
                <h1 className="text-accent text-2xl md:text-3xl font-bold">Edit Event</h1>
            </div>
            <TicketStats eventId={eventId} />
            <Tabs defaultValue="event-information" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="event-information" className="w-full">Event Information</TabsTrigger>
                    <TabsTrigger value="ticket-management" className="w-full">Ticket Management</TabsTrigger>
                </TabsList>
                <TabsContent value="event-information">
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-6 gap-2">
                            <Loader2 className="size-12 animate-spin" />
                            <p className="text-muted-foreground">Loading event information...</p>
                        </div>
                    }>
                        <GetOrganizerEventRender eventId={eventId} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="ticket-management">
                    <TicketManagement eventId={eventId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

async function GetOrganizerEventRender({ eventId }: { eventId: string }) {
    const event = await getOrganizerEvent(eventId);

    return (
        <EditEventForm data={event} />
    )
}
