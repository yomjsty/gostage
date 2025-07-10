import Beams from "@/components/ui/beams";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="mx-auto min-h-screen flex items-center justify-center w-full relative"
        >
            <main className="w-full max-w-md space-y-4 py-10 md:py-4 px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                        <ArrowLeftIcon className="w-4 h-4" />
                        Home
                    </Link>
                    <ModeToggle />
                </div>
                <Beams
                    beamWidth={2}
                    beamHeight={15}
                    beamNumber={12}
                    lightColor="#ffffff"
                    speed={2}
                    noiseIntensity={1.75}
                    scale={0.2}
                    rotation={0}
                />
                {children}
            </main>
        </div>
    )
}
