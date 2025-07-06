import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrganizerEvent } from "@/dal/organizer/get-organizer-events";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: OrganizerEvent
}

export function EventSingleCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.featuredImage);
    const startDate = new Date(data.startDate);

    return (
        <Link href={`/event/${data.slug}`}>
            <Card className="p-0 gap-3">
                <div className="relative">
                    <Image src={thumbnailUrl} alt={data.title} className="h-48 w-full object-cover rounded-t-lg" width={600} height={400} />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
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

                <Separator />

                <CardContent className="space-y-3 px-4 -mt-1 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground line-clamp-1">{data.location}</span>
                </CardContent>
            </Card>
        </Link>
    )
}
