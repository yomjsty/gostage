import { getUserTicketsByOrderId } from "@/dal/user/get-user-tickets-by-orderid"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import SingularTicketCard from "./_components/SingularTicketCard"
import { buttonVariants } from "@/components/ui/button"
import { EventDetailsCard } from "./_components/EventDetailsCard"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
    title: "My Tickets",
    description: "View your tickets.",
};

export default async function MyTicketSingularPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <Link href="/my-tickets" className={cn(buttonVariants({ variant: "outline" }))}>
                <ArrowLeftIcon className="w-4 h-4" />
                My Tickets
            </Link>
            <Suspense fallback={<MyTicketSingularSkeleton />}>
                <RenderMyTicketSingularPage orderId={orderId} />
            </Suspense>
        </div>
    )
}

function MyTicketSingularSkeleton() {
    return (
        <Card className="p-0 gap-0">
            <Skeleton
                className="aspect-video"
            />
            <CardContent className="space-y-4 px-6 py-4">
                <div className="flex-1 space-y-4">
                    <Skeleton className="w-1/2 h-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <Skeleton className="w-1/2 h-4" />
                        <Skeleton className="w-1/2 h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                </div>
            </CardContent>
        </Card>
    )
}

async function RenderMyTicketSingularPage({ orderId }: { orderId: string }) {
    const tickets = await getUserTicketsByOrderId(orderId)

    return (

        <div className="space-y-4">
            <EventDetailsCard ticket={tickets[0]} />
            <h1 className="text-2xl font-bold">Your Tickets ({tickets.length})</h1>
            <div className="grid md:grid-cols-2 gap-4">
                {tickets.map((ticket, index) => (
                    <SingularTicketCard key={ticket.id} ticket={ticket} index={index} />
                ))}
            </div>
        </div>
    )
}
