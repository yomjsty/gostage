"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ticketCategorySchema, TicketCategorySchemaType } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { updateTicketCategory } from "../actions"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, PencilIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { TicketCategories } from "@/dal/ticket/get-ticket-categories"

const formatRupiah = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d]/g, '')) : value
    if (isNaN(numValue)) return ''
    return numValue.toLocaleString('id-ID')
}

const parseRupiah = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0
}

export function EditTicketCategoryForm({ category }: { category: TicketCategories }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [isOpen, setOpen] = useState(false);
    const queryClient = useQueryClient()
    const form = useForm<TicketCategorySchemaType>({
        resolver: zodResolver(ticketCategorySchema),
        defaultValues: {
            name: category.name,
            price: category.price || 0,
            quota: category.quota || 0,
        },
    })

    function onSubmit(values: TicketCategorySchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateTicketCategory(values, category.id))

            if (error) {
                toast.error(error.message)
            }

            if (result?.status === "success") {
                setOpen(false)
                toast.success(result.message)
                form.reset()
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["ticket-categories"] }),
                    router.refresh()
                ])
            } else if (result?.status === "error") {
                toast.error(result.message)
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PencilIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Ticket Category</DialogTitle>
                    <DialogDescription>
                        Update the ticket category information
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="North Seat" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-muted-foreground/80 text-muted px-2 py-2 rounded-md text-sm">Rp.</span>
                                            <Input
                                                placeholder="100.000"
                                                type="text"
                                                value={formatRupiah(field.value)}
                                                onChange={(e) => {
                                                    const numericValue = parseRupiah(e.target.value)
                                                    field.onChange(numericValue)
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quota"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quota</FormLabel>
                                    <FormControl>
                                        <Input placeholder="50" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : "Update"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
