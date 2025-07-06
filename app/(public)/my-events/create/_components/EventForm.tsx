"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { eventSchema, EventSchemaType } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DateTimePicker } from "../../../_components/DateTimePicker"
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
import { createEvent } from "../actions"
import { toast } from "sonner"
import { CircleAlert, Loader2, X } from "lucide-react"
import { UploadButton } from "@/lib/uploadthing"
import { useState } from "react"
import Image from "next/image"
import { env } from "@/lib/env"
import { useQueryClient } from "@tanstack/react-query"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"

export function EventForm() {
    const [isPending, startTransition] = useTransition();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const queryClient = useQueryClient()
    const router = useRouter();

    const form = useForm<EventSchemaType>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            featuredImage: "",
            description: "",
            startDate: undefined,
            endDate: undefined,
            location: "",
            locationLink: "",
            mode: "OFFLINE",
            maxTicketsPerUser: 4,
        },
    })

    function onSubmit(values: EventSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createEvent(values))

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

            setImagePreview(`https://${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${imageKey}`);

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
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Creating event...</span>
                                </>
                            ) : "Create Event"}
                        </Button>
                        <p className="flex gap-1 items-center text-[11px] text-gray-500 -mt-3">
                            <CircleAlert className="size-3.5" /> Newly created event will be drafted, to publish it go to edit page later.
                        </p>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}