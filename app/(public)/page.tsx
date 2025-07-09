import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AllEventCard } from "./_components/AllEventCard";
import { FeaturedEvents } from "./_components/FeaturedEvents";
import { getAllFeaturedEvents } from "@/dal/event/get-all-featured-events";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Home",
  description: "The easiest and cheapest ticket purchase is only at GoStage.",
};

export default function Home() {
  return (
    <div className="space-y-8 pt-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Featured Events</h1>

        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <GetFeaturedEvents />
        </Suspense>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }))}>View All</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AllEventCard />
        </div>
      </div>
    </div>
  )
}

async function GetFeaturedEvents() {
  const event = await getAllFeaturedEvents();

  return (
    <FeaturedEvents data={event} />
  )
}