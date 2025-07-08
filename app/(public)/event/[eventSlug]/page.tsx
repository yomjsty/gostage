
import SingleEventPage from "./_components/SingleEventPage";

export default async function EventPage({ params }: { params: Promise<{ eventSlug: string }> }) {
    const { eventSlug } = await params;

    return (
        <SingleEventPage eventSlug={eventSlug} />
    )
}

