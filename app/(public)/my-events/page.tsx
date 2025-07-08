import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { OrganizerEventCard } from "../_components/OrganizerEventCard";

export default function MyEventsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Events</h1>
                <Link href="/my-events/create" className={cn(buttonVariants({ variant: "outline" }))}>
                    Create New Event
                </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OrganizerEventCard />
            </div>
        </div>
    )
}