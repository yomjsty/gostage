import { getUserTickets } from "@/dal/user/get-user-tickets"
import { Suspense } from "react"
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
// } from "@/components/ui/tabs"
import { SingleCardTicketEvent } from "./_components/SingleCardTicketEvent"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyTicketsPage() {
    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold">My Tickets</h1>
            <Suspense fallback={<UserTicketsSkeleton />}>
                <RenderUserTickets />
            </Suspense>
        </div>
    )
}

function UserTicketsSkeleton() {
    return (
        Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-0 gap-0">
                <CardContent className="grid grid-cols-8 gap-4 p-4">
                    <div className="col-span-3 md:col-span-2 relative aspect-video">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="col-span-5 md:col-span-6">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-1/2 h-4" />
                                <Skeleton className="w-2/3 h-4" />
                            </div>

                            <div className="hidden md:flex items-center justify-between gap-2 mt-2">
                                <div className="w-2/3 flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        <Skeleton className="w-2/12 h-4" />
                                    </span>
                                    <span className="text-sm font-medium">
                                        <Skeleton className="w-3/12 h-4" />
                                    </span>
                                </div>
                                <div className="flex w-1/3 flex-col gap-1">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        <Skeleton className="w-2/12 h-4" />
                                    </span>
                                    <span className="text-sm font-medium">
                                        <Skeleton className="w-3/12 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))

    )
}

async function RenderUserTickets() {
    const tickets = await getUserTickets()

    const groupedEvents = groupTicketsByEvent(tickets)

    return (
        <div className="grid gap-4">
            {groupedEvents.map((group) => (
                <SingleCardTicketEvent
                    key={group.event.id}
                    event={group.event}
                    total={group.total}
                    orderId={group.orderId}
                />
            ))}
        </div>
    )
}

function groupTicketsByEvent(tickets: Awaited<ReturnType<typeof getUserTickets>>) {
    const map = new Map<
        string,
        {
            event: typeof tickets[0]["category"]["event"]
            total: number
            orderId: string | undefined
        }
    >()

    for (const ticket of tickets) {
        const event = ticket.category.event
        const key = event.id
        const orderId = ticket.reservation?.orderId

        if (map.has(key)) {
            map.get(key)!.total += 1
        } else {
            map.set(key, { event, total: 1, orderId })
        }
    }

    return Array.from(map.values())
}
