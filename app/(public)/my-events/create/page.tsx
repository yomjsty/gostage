import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { EventForm } from "./_components/EventForm";

export const metadata = {
    title: "Create Event",
    description: "Create a new event.",
};

export default function CreateEventPage() {
    return (
        <div className="space-y-4">
            <div className="px-8 py-12 bg-accent-foreground rounded-xl flex items-center justify-between">
                <Link href="/my-events" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ChevronLeft className="size-4" />
                </Link>
                <h1 className="text-accent text-2xl md:text-3xl font-bold">Create Event</h1>
            </div>
            <EventForm />
        </div>
    )
}
