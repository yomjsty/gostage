"use client"

import { Badge } from "@/components/ui/badge"
import { AllEventType } from "@/dal/event/get-all-events"
import { useConstructUrl } from "@/hooks/use-construct-url"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { toggleFeatured } from "../actions"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { tryCatch } from "@/hooks/try-catch"

function ImageCell({ featuredImage, title }: { featuredImage: string; title: string }) {
    const thumbnailUrl = useConstructUrl(featuredImage)
    return (
        <Image
            src={thumbnailUrl}
            alt={title}
            className="aspect-video max-w-52"
            width={400}
            height={200}
        />
    )
}

function ActionsCell({ id, featured }: { id: string; featured: boolean }) {
    const [isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleToggleFeatured = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(toggleFeatured(id))

            if (error) {
                toast.error("An unexpected error occurred")
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['my-events'] }),
                    queryClient.invalidateQueries({ queryKey: ['events'] }),
                    router.refresh()
                ])
            } else {
                toast.error(result?.message || "An unexpected error occurred")
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={handleToggleFeatured}
                    disabled={isPending}
                >
                    {featured ? "Remove from featured" : "Set as featured"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View event details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<AllEventType>[] = [
    {
        accessorKey: "featuredImage",
        header: () => (
            <div className="flex items-center gap-1">
                Featured Image
            </div>
        ),
        cell: ({ row }) => (
            <ImageCell
                featuredImage={row.original.featuredImage}
                title={row.original.title}
            />
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const title = row.original.title
            return <div className="max-w-md truncate">{title}</div>
        }
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => {
            const startDate = row.original.startDate
            return <div>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        }
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const location = row.original.location
            return <div className="max-w-80 text-wrap">{location}</div>
        }
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
            const featured = row.original.featured
            return <div>{featured ? (
                <Badge variant="default">Yes</Badge>
            ) : (
                <Badge variant="outline">No</Badge>
            )}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell id={row.original.id} featured={row.original.featured} />
    },
]