import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Card } from "@/components/ui/card";
import { TicketCategoryForm } from "./TicketCategoryForm";
import { TicketCategoryTable } from "./TicketCategoryTable";

export function TicketManagement({ eventId }: { eventId: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold">Ticket Management</h1>
                            <p className="text-sm text-muted-foreground font-normal">Manage your event ticket categories, pricing, and quota</p>
                        </div>
                        <TicketCategoryForm eventId={eventId} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <TicketCategoryTable eventId={eventId} />
            </CardContent>
        </Card>
    )
}
