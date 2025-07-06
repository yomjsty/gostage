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
import { Pencil, Trash } from "lucide-react"
import { TicketCategories } from "@/dal/ticket/get-ticket-categories"
import { Badge } from "@/components/ui/badge"

export function TicketCategoryTable({ eventId }: { eventId: string }) {
    const { data: ticketCategories, isLoading, error } = useGetTicketCategories(eventId)

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading ticket categories</p>

    if (!ticketCategories || ticketCategories.length === 0) return <p>No ticket categories found</p>

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
                            <Button variant="outline" size="icon">
                                <Pencil className="size-4" />
                            </Button>
                            <Button variant="destructive" size="icon">
                                <Trash className="size-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
