"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetTicketCategories } from "@/lib/queries"
import { Loader2, TrashIcon } from "lucide-react"
import { TicketCategories } from "@/dal/ticket/get-ticket-categories"
import { Badge } from "@/components/ui/badge"
import { EditTicketCategoryForm } from "./EditTicketCategoryForm"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTransition } from "react"
import { deleteTicketCategory } from "../actions"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function TicketCategoryTable({ eventId }: { eventId: string }) {
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient()
    const router = useRouter()
    const { data: ticketCategories, isLoading, error } = useGetTicketCategories(eventId)

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading ticket categories</p>

    if (!ticketCategories || ticketCategories.length === 0) return <p>No ticket categories found</p>

    const handleDeleteTicketCategory = async (categoryId: string) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteTicketCategory(categoryId, eventId))

            if (error) {
                toast.error("An unexpected error occurred. Please try again later.")
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["ticket-categories"] }),
                    router.refresh()
                ])
            } else if (result.status === "error") {
                toast.error(result.message)
            }
        })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Category Name</TableHead>
                    <TableHead className="text-muted-foreground">Price</TableHead>
                    <TableHead className="text-muted-foreground">Sold / Quota</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Revenue</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ticketCategories.map((category: TicketCategories) => (
                    <TableRow key={category.id}>
                        <TableCell className="font-semibold">{category.name}</TableCell>
                        <TableCell>Rp. {category.price?.toLocaleString()}</TableCell>
                        <TableCell className="space-y-0.5">
                            <p>{category.sold || 0} / {category.quota || 0}</p>
                            <Progress
                                value={category.quota ? (category.sold || 0) / category.quota * 100 : 0}
                                className="w-1/2"
                            />
                        </TableCell>
                        <TableCell>
                            <Badge variant={category.quota && category.sold ?
                                (category.sold >= category.quota ? 'destructive' : 'default') :
                                'default'
                            }>
                                {category.quota && category.sold ?
                                    (category.sold >= category.quota ? 'Sold Out' : 'Available') :
                                    'Available'
                                }
                            </Badge>
                        </TableCell>
                        <TableCell>Rp. {((category.sold || 0) * (category.price || 0)).toLocaleString()}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                            <EditTicketCategoryForm category={category} />
                            <AlertDialog >
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <TrashIcon className="size-3" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your ticket category and all associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteTicketCategory(category.id)}
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
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
