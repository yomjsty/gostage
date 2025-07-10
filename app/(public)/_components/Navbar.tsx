"use client"

import { SearchIcon } from "lucide-react"
import Logo from "@/components/logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"
import { AuthModal } from "./AuthModal"
import { authClient } from "@/lib/auth-client"
import { UserButton } from "@/components/user/UserButton"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#", label: "Explore" }
]

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-4 container mx-auto px-4 md:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-primary hover:text-primary/90">
                <Logo />
              </Link>
              {/* Navigation menu */}
              <NavigationMenu className="max-md:hidden">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        href={link.href}
                        className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            {/* Search form */}
            <div className="relative hidden md:block">
              <Input
                className="peer h-8 ps-8 pe-2"
                placeholder="Search..."
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <ModeToggle />
        {isPending ? null : session ? (
          <UserButton name={session.user?.name} email={session.user?.email} image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`} role={session?.user?.role ?? undefined} />
        ) : (
          <>
            <div className="items-center gap-2 hidden md:flex">
              <AuthModal type="register" name="Register" />
              <AuthModal type="login" name="Login" />
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Link className={cn(buttonVariants({ variant: "outline" }))} href="/register">
                Register
              </Link>
              <Link className={cn(buttonVariants({ variant: "default" }))} href="/login">
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
