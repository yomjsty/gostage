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
import { EyeIcon, Loader2, PencilIcon, TrashIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { tryCatch } from "@/hooks/try-catch";
import { deleteEvent } from "../my-events/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";

export function OrganizerEventCard() {
    const { data: myEvents, isLoading, error } = useGetMyEvents()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isPending, startTransition] = useTransition();
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

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
            <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">You haven&apos;t created any events yet.</p>
            </div>
        )
    }

    const handleDeleteEvent = async (eventId: string) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteEvent(eventId))

            if (error) {
                toast.error("An unexpected error occurred. Please try again later.")
                return
            }

            if (result.status === "success") {
                setEventToDelete(null);
                toast.success(result.message)
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['my-events'] }),
                    queryClient.invalidateQueries({ queryKey: ['events'] }),
                ])
                router.refresh();
            } else if (result.status === "error") {
                toast.error(result.message)
            }
        })
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
                        {event.status === "DRAFT" ? (
                            <Button variant="outline" className="flex-1" disabled>
                                <EyeIcon className="size-3" />
                                Preview
                            </Button>
                        ) : (
                            <Link className={cn(buttonVariants({ variant: "outline", className: "flex-1" }))} href={`/event/${event.slug}`} target="_blank">
                                <EyeIcon className="size-3" />
                                Preview
                            </Link>
                        )}
                        <AlertDialog open={eventToDelete === event.id} onOpenChange={(open) => setEventToDelete(open ? event.id : null)}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex-1">
                                    <TrashIcon className="size-3" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your event and all associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteEvent(event.id)}
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="size-3 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : "Delete"}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
        </>
    )
}