"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserTicketByOrderIdType } from "@/dal/user/get-user-tickets-by-orderid";
import { DownloadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCodeJS from "qrcode";
// import QRCode from "react-qr-code";
// import html2canvas from "html2canvas";

interface iAppProps {
    ticket: UserTicketByOrderIdType,
    index: number
}

export default function SingularTicketCard({ ticket, index }: iAppProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeJS.toCanvas(canvasRef.current, ticket.qrCode, {
                width: 200,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff"
                }
            }, (error) => {
                if (!error) setReady(true);
            });
        }
    }, [ticket.qrCode]);

    const handleDownload = async () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `ticket-${ticket.id}.png`;
        link.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <p className="text-xl">
                        Ticket #{index + 1}
                    </p>

                    <Badge className="bg-emerald-500/20 text-emerald-500">
                        {ticket.reservation?.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Category:</span>
                        <span className="text-sm font-bold tracking-wide">{ticket.category.name}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Price:</span>
                        <span className="text-sm font-bold tracking-wide">Rp {ticket.category.price.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 flex flex-col">
                        <span className="text-muted-foreground text-sm">Ticket ID:</span>
                        <span className="text-sm tracking-wide">{ticket.id}</span>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col items-center justify-center gap-4">
                    <span className="text-muted-foreground text-base font-medium">QR Code</span>

                    {/* <QRCode value={ticket.qrCode} className="aspect-square size-40" /> */}

                    <canvas ref={canvasRef} className="rounded bg-white" />

                    <Button onClick={handleDownload} disabled={!ready} className="w-full mt-2" variant="outline">
                        <DownloadIcon className="w-4 h-4" />
                        Download QR Code
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
