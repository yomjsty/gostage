"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DateTimePicker } from "@/app/(public)/_components/DateTimePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import { UploadButton } from "@/lib/uploadthing"
import { useState } from "react"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { eventSchema, EventSchemaType } from "@/lib/zodSchema"
import { OrganizerEvent } from "@/dal/organizer/get-organizer-event"
import { updateEvent, updateEventStatus } from "../actions"
import { useConstructUrl } from "@/hooks/use-construct-url"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"

interface iAppProps {
    data: OrganizerEvent
}

export function EditEventForm({ data }: iAppProps) {
    const [isPending, startTransition] = useTransition();
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublishingAction, setIsPublishingAction] = useState(false);
    const constructUrl = useConstructUrl(data.featuredImage || "");
    const [imagePreview, setImagePreview] = useState<string | null>(
        data.featuredImage ? constructUrl : null
    );
    const queryClient = useQueryClient()
    const router = useRouter();

    const form = useForm<EventSchemaType>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: data.title,
            featuredImage: data.featuredImage,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            location: data.location,
            locationLink: data.locationLink || undefined,
            mode: data.mode,
            maxTicketsPerUser: data.maxTicketsPerUser,
        },
    })

    function onSubmit(values: EventSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateEvent(values, data.id))

            if (error) {
                toast.error("An unexpected error occurred. Please try again later.")
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['my-events'] }),
                    queryClient.invalidateQueries({ queryKey: ['events'] }),
                ])
                router.push(`/my-events`)
            } else if (result.status === "error") {
                toast.error(result.message)
            }
        })
    }

    const handleImageUploadComplete = (res: { key: string; url: string }[]) => {
        if (res && res[0]) {
            const imageKey = res[0].key;

            form.setValue("featuredImage", imageKey);

            setImagePreview(getImageUrl(imageKey));

            toast.success("Image uploaded successfully!");
        }
    };

    const handleImageUploadError = (error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
    };

    const removeImage = () => {
        form.setValue("featuredImage", "");
        setImagePreview(null);
        toast.success("Image removed");
    };

    // Helper function to construct URL
    const getImageUrl = (key: string) => {
        return `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${key}`;
    };

    const handleStatusChange = () => {
        const newStatus = data.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
        const isPublishing = newStatus === "PUBLISHED";
        setIsPublishing(true);
        setIsPublishingAction(isPublishing);
        startTransition(async () => {
            try {
                const { data: result, error } = await tryCatch(updateEventStatus(data.id, newStatus))

                if (error) {
                    toast.error("An unexpected error occurred. Please try again later.")
                    return
                }

                if (result.status === "success") {
                    toast.success(result.message)
                    await Promise.all([
                        queryClient.invalidateQueries({ queryKey: ['my-events'] }),
                        queryClient.invalidateQueries({ queryKey: ['events'] }),
                    ])
                    router.refresh()
                } else if (result.status === "error") {
                    toast.error(result.message)
                }
            } catch {
                toast.error("An unexpected error occurred. Please try again later.")
            } finally {
                setIsPublishing(false);
            }
        })
    };

    return (
        <Card>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Event Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Mode</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Event Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="OFFLINE">Offline</SelectItem>
                                                    <SelectItem value="ONLINE">Online</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxTicketsPerUser"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Tickets Per User</FormLabel>
                                        <FormControl>
                                            <Input placeholder="4" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jembatan Ampera, Palembang, Indonesia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="locationLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location Link <span className="text-xs text-gray-500">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://maps.app.goo.gl/1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="featuredImage"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Featured Image</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                        <Image
                                                            src={imagePreview}
                                                            alt="Event preview"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={removeImage}
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={handleImageUploadComplete}
                                                    onUploadError={handleImageUploadError}
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending} variant="outline">
                                {isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Updating event...</span>
                                    </>
                                ) : "Update Event"}
                            </Button>
                            <Button
                                type="button"
                                variant={data.status === "DRAFT" ? "default" : "outline"}
                                disabled={isPublishing}
                                onClick={handleStatusChange}
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>{isPublishingAction ? "Publishing event..." : "Drafting event..."}</span>
                                    </>
                                ) : data.status === "DRAFT" ? "Publish Event" : "Draft Event"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    )
}
