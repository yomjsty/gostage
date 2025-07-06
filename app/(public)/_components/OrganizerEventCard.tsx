"use client"

import { useGetMyEvents } from "@/lib/queries"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizerEvent } from "@/dal/organizer/get-organizer-events";
import { EventSingleCard } from "./EventSingleCard";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";

export function OrganizerEventCard() {
    const { data: myEvents, isLoading, error } = useGetMyEvents()

    if (isLoading) return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-0 gap-3">
                    <Skeleton className="h-48 w-full object-cover rounded-t-lg" />
                    <CardHeader className="px-4 pt-1 gap-1.5">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-3 px-4 -mt-1 pb-2">
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            ))}
        </>
    )
    if (error) return <p>Error loading my events</p>

    if (!myEvents || myEvents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">You haven&apos;t created any events yet.</p>
            </div>
        )
    }

    return (
        <>
            {myEvents?.map((event: OrganizerEvent) => (
                <div key={event.id} className="flex flex-col gap-2">
                    <EventSingleCard data={event} />
                    <div className="flex gap-2">
                        <Link className={cn(buttonVariants({ variant: "outline", className: "flex-1" }))} href={`/my-events/edit/${event.id}`}>
                            <PencilIcon className="size-3" />
                            Edit
                        </Link>
                        <Link className={cn(buttonVariants({ variant: "outline", className: "flex-1" }))} href={`/event/${event.slug}`} target="_blank">
                            <EyeIcon className="size-3" />
                            Preview
                        </Link>
                        <Button variant="destructive" className="flex-1">
                            <TrashIcon className="size-3" />
                        </Button>
                    </div>
                </div>
            ))}
        </>
    )
}