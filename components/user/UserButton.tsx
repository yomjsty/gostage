import {
    CalendarFoldIcon,
    ChevronDownIcon,
    Home,
    LayoutDashboardIcon,
    LogOutIcon,
    TicketIcon,
    UserPenIcon,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSignOut } from "@/hooks/use-signout"

interface iAppProps {
    name: string;
    email: string;
    image: string;
    role?: string;
}

export function UserButton({ name, email, image, role }: iAppProps) {

    const handleSignout = useSignOut();
    const isAdmin = role === "admin";
    const isOrganizer = role === "organizer";
    const canAccessEvents = isAdmin || isOrganizer;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src={image} alt="Profile image" />
                        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <Home size={16} className="opacity-60" aria-hidden="true" />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>Admin Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {canAccessEvents && (
                        <DropdownMenuItem asChild>
                            <Link href="/my-events">
                                <CalendarFoldIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>My Events</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/my-tickets">
                            <TicketIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>My Tickets</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/account">
                            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Account</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleSignout}>
                        <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
