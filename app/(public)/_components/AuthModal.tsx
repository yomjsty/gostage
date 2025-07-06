"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import LoginTabs from "./LoginTabs"
import RegisterTabs from "./RegisterTabs"

interface iAppProps {
    type: "login" | "register"
    name: string
}

export function AuthModal({ type, name }: iAppProps) {
    const [activeTab, setActiveTab] = useState<"login" | "register">(type)
    const [open, setOpen] = useState(false)

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (isOpen) {
                    // reset tab ke default type
                    setActiveTab(type)
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant={type === "login" ? "default" : "outline"}>
                    {name}
                </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4 pb-0">
                <DialogHeader className="gap-0">
                    <DialogTitle className="text-xl md:text-2xl font-extrabold text-center">Welcome to GoStage</DialogTitle>
                    <DialogDescription className="text-center">
                        Login or create an account to get started
                    </DialogDescription>
                </DialogHeader>
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "login" | "register")
                    }
                    className="items-center"
                >
                    <TabsList className="h-auto rounded-none border-b bg-transparent p-0 w-full">
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:after:bg-primary data-[state=active]:text-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-semibold w-full"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="data-[state=active]:after:bg-primary data-[state=active]:text-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-semibold w-full"
                        >
                            Register
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="w-full px-4">
                        <LoginTabs />
                    </TabsContent>
                    <TabsContent value="register" className="w-full px-4">
                        <RegisterTabs />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
