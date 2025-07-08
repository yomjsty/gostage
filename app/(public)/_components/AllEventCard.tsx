"use client"

import { useGetAllEvents } from "@/lib/queries"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AllEventType } from "@/dal/event/get-all-events";
import { AllEventSingleCard } from "./AllEventSingleCard";

export function AllEventCard() {
    const { data: allEvents, isLoading, error } = useGetAllEvents()

    if (isLoading) return (
        <>
            {Array.from({ length: 8 }).map((_, index) => (
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
    if (error) return <p>Error loading all events</p>

    if (!allEvents || allEvents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
            </div>
        )
    }

    return (
        <>
            {allEvents?.map((event: AllEventType) => (
                <AllEventSingleCard data={event} key={event.id} />
            ))}
        </>
    )
}