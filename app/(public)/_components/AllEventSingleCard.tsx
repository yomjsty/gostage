import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AllEventType } from "@/dal/event/get-all-events";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AllEventType
}

export function AllEventSingleCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.featuredImage);
    const startDate = new Date(data.startDate);

    // Calculate ticket status
    const totalSold = data.categories?.reduce((acc, category) => acc + (category.sold || 0), 0) || 0;
    const totalQuota = data.categories?.reduce((acc, category) => acc + (category.quota || 0), 0) || 0;

    let ticketStatus = "NOT AVAILABLE";
    let badgeVariant: "default" | "secondary" | "destructive" = "destructive";

    if (totalQuota > 0) {
        if (totalSold >= totalQuota) {
            ticketStatus = "SOLD OUT";
            badgeVariant = "destructive";
        } else {
            ticketStatus = "AVAILABLE";
            badgeVariant = "default";
        }
    }

    return (
        <Link href={`/event/${data.slug}`}>
            <Card className="p-0 gap-3">
                <div className="relative">
                    <Image src={thumbnailUrl} alt={data.title} className="h-48 w-full object-cover rounded-t-lg" width={600} height={400} priority />
                    <div className="absolute top-2 left-2">
                        <Badge variant={badgeVariant} className={badgeVariant === "destructive" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}>
                            {ticketStatus}
                        </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="">
                            {data.mode}
                        </Badge>
                    </div>
                </div>

                <CardHeader className="px-4 pt-1 gap-1.5">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-base font-bold leading-tight line-clamp-1 hover:text-primary/90">{data.title}</h3>
                        <span className="text-xs font-semibold">{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground line-clamp-1">{data.description}</p>
                </CardHeader>

                <Separator className="-mt-1.5" />

                <CardContent className="space-y-3 px-4 -mt-1 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground line-clamp-1">{data.location}</span>
                </CardContent>
            </Card>
        </Link>
    )
}
