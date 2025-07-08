"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useGetEventBySlug } from "@/lib/queries";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

interface iAppProps {
    eventSlug: string
}

function EventPageSkeleton() {
    return (
        <>
            <div className="max-w-5xl mx-auto pb-4 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                    <div className="col-span-1 md:col-span-5 flex flex-col gap-2">
                        <Skeleton className="w-full h-[400px] rounded-lg" />
                        <div className="flex flex-col gap-2 md:hidden">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <div className="flex items-center gap-1">
                                    <Skeleton className="size-4 rounded" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Skeleton className="size-4 rounded" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <Separator className="my-2" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col gap-2 pt-1">
                            <Skeleton className="h-6 w-24" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <div className="md:sticky md:top-4 md:self-start">
                            <Separator className="mb-4 md:hidden" />
                            <Card className="p-0 gap-0">
                                <Skeleton className="items-center w-full md:hidden px-4 h-32" />
                                <CardContent className="hidden md:block p-0 pt-4 space-y-2 px-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-4 rounded" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-4 rounded" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </CardContent>
                                <Separator className="mt-4 mb-3 hidden md:block" />
                                <CardFooter className="p-0 px-4 pb-3 flex-col items-start hidden md:flex">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </CardFooter>
                            </Card>
                            <div className="bg-background p-4 hidden md:block border border-border rounded-lg shadow-md mt-3">
                                <div className="flex flex-col items-center justify-between gap-2">
                                    <div className="flex flex-col self-start">
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Component Skeleton */}
            <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 md:hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48 mt-1" />
                        </div>
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default function SingleEventPage({ eventSlug }: iAppProps) {
    const { data: event, isLoading, error } = useGetEventBySlug(eventSlug)

    const thumbnailUrl = useConstructUrl(event?.featuredImage)

    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) return <EventPageSkeleton />
    if (error) return notFound()

    return (
        <>
            <div className="max-w-5xl mx-auto pb-4 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                    <div className="col-span-1 md:col-span-5 flex flex-col gap-2">
                        <Image
                            src={thumbnailUrl}
                            alt={`Event thumbnail for ${event.title}`}
                            className="object-cover w-full"
                            width={600}
                            height={400}
                        />
                        <div className="flex flex-col gap-2 md:hidden">
                            <div className="space-y-2">
                                <h1 className="text-lg font-extrabold tracking-tight">{event.title}</h1>
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    <span className="text-xs font-semibold">
                                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="size-4 shrink-0" />
                                    <span className="text-xs font-semibold">
                                        {event.location}
                                    </span>
                                </div>
                                {event.locationLink && (
                                    <Link
                                        href={event.locationLink}
                                        className={cn(buttonVariants({ variant: "outline", size: "sm", className: "w-fit text-xs" }))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ChevronRight className="size-3.5" />
                                        Google Maps
                                    </Link>
                                )}
                            </div>
                            <Separator className="my-2" />
                            <div className="flex flex-col gap-1 text-sm font-semibold tracking-tight">
                                <span className="text-muted-foreground">
                                    Organized by
                                </span>
                                <span className="">
                                    {event.User.name}
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col gap-2 pt-1">
                            <h1 className="text-lg font-extrabold tracking-tight">Description</h1>
                            <p className="text-sm whitespace-pre-line font-medium pb-3">
                                {event.description || "No description available."}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <div className="md:sticky md:top-4 md:self-start">
                            <Separator className="mb-4 md:hidden" />
                            <Card className="p-0 gap-0">
                                <Tabs defaultValue="description" className="items-center w-full md:hidden px-4">
                                    <TabsList className="h-auto rounded-none border-b bg-transparent p-0 w-full ">
                                        <TabsTrigger
                                            value="description"
                                            className="data-[state=active]:after:bg-primary relative rounded-none py-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full font-semibold"
                                        >
                                            Description
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="social-media"
                                            className="data-[state=active]:after:bg-primary relative rounded-none py-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full font-semibold"
                                        >
                                            Social Media
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="description">
                                        <p className="text-sm whitespace-pre-line font-medium pb-3">
                                            {event.description || "No description available."}
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="social-media">
                                        <p className="text-muted-foreground p-4 text-center text-xs">
                                            Social media links will be available soon.
                                        </p>
                                    </TabsContent>
                                </Tabs>
                                <CardContent className="hidden md:block p-0 pt-4 space-y-2 px-4">
                                    <h1 className="text-lg font-extrabold tracking-tight text-left">{event.title}</h1>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 shrink-0" />
                                        <span className="text-xs font-semibold">
                                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 shrink-0" />
                                        <span className="text-xs font-semibold">
                                            {event.location}
                                        </span>
                                    </div>
                                    {event.locationLink && (
                                        <Link
                                            href={event.locationLink}
                                            className={cn(buttonVariants({ variant: "outline", size: "sm", className: "w-fit text-xs" }))}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ChevronRight className="size-3.5" />
                                            Google Maps
                                        </Link>
                                    )}
                                </CardContent>
                                <Separator className="mt-4 mb-3 hidden md:block" />
                                <CardFooter className="p-0 px-4 pb-3 flex-col items-start hidden md:flex">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Organized by
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {event.User.name}
                                    </p>
                                </CardFooter>
                            </Card>
                            <div className="bg-background p-4 hidden md:block border border-border rounded-lg shadow-md mt-3">
                                <div className="flex flex-col items-center justify-between gap-2">
                                    <div className="flex flex-col self-start">
                                        <span className="text-sm font-semibold">{event.title}</span>
                                    </div>
                                    {(!event.categories || event.categories.length === 0) ? (
                                        <Button
                                            type="button"
                                            className="font-semibold w-full"
                                            disabled
                                        >
                                            No Ticket Available Yet
                                        </Button>
                                    ) : (
                                        <Link
                                            href={`/event/${eventSlug}/tickets`}
                                            className={cn(buttonVariants({ size: "lg", className: "font-semibold w-full" }))}
                                        >
                                            Buy Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Component */}
            <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 md:hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{event.title}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(event.startDate)} - {formatDate(event.endDate)} • {event.location}</span>
                        </div>
                        {(!event.categories || event.categories.length === 0) ? (
                            <button
                                className={cn(buttonVariants({ size: "lg", className: "font-semibold" }))}
                                type="button"
                                disabled
                            >
                                No Ticket Available Yet
                            </button>
                        ) : (
                            <Link
                                href={`/event/${eventSlug}/tickets`}
                                className={cn(buttonVariants({ size: "lg", className: "font-semibold" }))}
                            >
                                Buy Now
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

