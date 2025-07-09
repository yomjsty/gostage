"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { AllFeaturedEventType } from "@/dal/event/get-all-featured-events"
import { env } from "@/lib/env"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"

interface iAppProps {
    data: AllFeaturedEventType[]
}

export function FeaturedEvents({ data }: iAppProps) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
            className="w-full"
        >
            <CarouselContent>
                {data.map((event) => (
                    <CarouselItem key={event.slug} className="basis-full md:basis-1/2 xl:basis-1/3">
                        <div className="rounded-lg overflow-hidden">
                            <Card className="p-0">
                                <CardContent className="flex aspect-video items-center justify-center p-6 relative">
                                    <Link href={`/event/${event.slug}`}>
                                        <Image
                                            src={`https://${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${event.featuredImage}`}
                                            alt={event.slug}
                                            className="w-full h-full object-cover rounded-lg"
                                            fill
                                        />
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
