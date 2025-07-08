import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AllEventCard } from "./_components/AllEventCard";

export default function Home() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Featured Events</h1>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }))}>View All</Link>
        </div>

        {/* Featured Events */}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }))}>View All</Link>
        </div>

        {/* Upcoming Events */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AllEventCard />
        </div>
      </div>
    </div>
  )
}
