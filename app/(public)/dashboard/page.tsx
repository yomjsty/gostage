import { getAllEvents } from "@/dal/event/get-all-events"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"

export const metadata = {
    title: "Admin Dashboard",
    description: "Manage your events and tickets as an admin.",
};

export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Suspense>
                <RenderAllEvents />
            </Suspense>
        </div>
    )
}

async function RenderAllEvents() {
    const event = await getAllEvents()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={event} />
        </div>
    )
}