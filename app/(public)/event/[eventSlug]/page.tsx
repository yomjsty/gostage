
import SingleEventPage from "./_components/SingleEventPage";
import { getEventBySlug, EventBySlugType } from "@/dal/event/get-event-by-slug";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ eventSlug: string }> }): Promise<Metadata> {
    const { eventSlug } = await params;
    const event: EventBySlugType = await getEventBySlug(eventSlug);

    return {
        title: event?.title || "Event Not Found",
        description: event?.description || "The easiest and cheapest ticket purchase is only at GoStage.",
    };
}

export default async function EventPage({ params }: { params: Promise<{ eventSlug: string }> }) {
    const { eventSlug } = await params;

    return (
        <SingleEventPage eventSlug={eventSlug} />
    )
}

